"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Loader2, Minus, Plus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const RENDER_WINDOW = 2;
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];

export type PdfHighlightRect = [number, number, number, number];

export interface PdfHighlightPassage {
    chunkId: string;
    pageNum: number;
    method: string;
    confidence: number;
    pages: Array<{ page: number; rects: PdfHighlightRect[] }>;
}

interface PdfViewport {
    width: number;
    height: number;
}

interface PdfPage {
    getViewport: (options: { scale: number }) => PdfViewport;
    render: (options: {
        canvasContext: CanvasRenderingContext2D;
        viewport: PdfViewport;
        transform?: number[] | null;
    }) => { promise: Promise<void>; cancel: () => void };
}

interface PdfDocument {
    numPages: number;
    getPage: (n: number) => Promise<PdfPage>;
    destroy: () => Promise<void>;
}

interface PdfjsModule {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (options: { url: string; withCredentials?: boolean }) => {
        promise: Promise<PdfDocument>;
    };
}

let pdfjsPromise: Promise<PdfjsModule> | null = null;

const loadPdfjs = (moduleUrl: string, workerUrl: string): Promise<PdfjsModule> => {
    if (!pdfjsPromise) {
        pdfjsPromise = import(/* webpackIgnore: true */ moduleUrl).then((mod: PdfjsModule) => {
            mod.GlobalWorkerOptions.workerSrc = workerUrl;
            return mod;
        });
    }
    return pdfjsPromise;
};

const HighlightLayer = ({ rects }: { rects: PdfHighlightRect[] }) => (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {rects.map(([x, y, w, h], index) => (
            <div
                key={index}
                className="absolute rounded-[1px] bg-amber-300/40 mix-blend-multiply ring-1 ring-amber-500/50"
                style={{
                    left: `${x * 100}%`,
                    top: `${y * 100}%`,
                    width: `${w * 100}%`,
                    height: `${h * 100}%`,
                }}
            />
        ))}
    </div>
);

const RenderedPage = ({
    doc,
    pageNumber,
    width,
    rects,
    onRendered,
}: {
    doc: PdfDocument;
    pageNumber: number;
    width: number;
    rects?: PdfHighlightRect[];
    onRendered?: () => void;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
        if (!width) return;
        let cancelled = false;
        let task: { cancel: () => void } | null = null;

        (async () => {
            const page = await doc.getPage(pageNumber);
            if (cancelled) return;

            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: width / base.width });
            const canvas = canvasRef.current;
            const context = canvas?.getContext("2d");
            if (!canvas || !context) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            setSize({ w: viewport.width, h: viewport.height });

            const render = page.render({
                canvasContext: context,
                viewport,
                transform: dpr === 1 ? null : [dpr, 0, 0, dpr, 0, 0],
            });
            task = render;
            try {
                await render.promise;
                if (!cancelled) onRendered?.();
            } catch {
                // cancelled by a resize, zoom or unmount
            }
        })();

        return () => {
            cancelled = true;
            task?.cancel();
        };
    }, [doc, pageNumber, width, onRendered]);

    return (
        <div
            className="relative bg-white shadow-sm"
            style={size ? { width: size.w, height: size.h } : { width }}
        >
            <canvas ref={canvasRef} className="block" />
            {rects && rects.length > 0 && <HighlightLayer rects={rects} />}
        </div>
    );
};

export interface JudgmentPdfViewerProps {
    open: boolean;
    onClose: () => void;
    /** Fully-resolved URL the PDF is streamed from. */
    pdfUrl: string | null;
    title?: string;
    passage?: PdfHighlightPassage | null;
    /** Sends cookies with the PDF request. Needed when the endpoint is auth-gated. */
    withCredentials?: boolean;
    pdfjsUrl?: string;
    pdfjsWorkerUrl?: string;
    className?: string;
}

export const JudgmentPdfViewer = ({
    open,
    onClose,
    pdfUrl,
    title,
    passage,
    withCredentials = true,
    pdfjsUrl = "/pdfjs/pdf.min.mjs",
    pdfjsWorkerUrl = "/pdfjs/pdf.worker.min.mjs",
    className,
}: JudgmentPdfViewerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const [doc, setDoc] = useState<PdfDocument | null>(null);
    const [shape, setShape] = useState<{ width: number; height: number } | null>(null);
    const [fitWidth, setFitWidth] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [visible, setVisible] = useState<Set<number>>(new Set());
    const [current, setCurrent] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [targetRendered, setTargetRendered] = useState(false);
    const [entered, setEntered] = useState(false);

    const targetPage = passage?.pages[0]?.page ?? passage?.pageNum ?? 1;
    const renderWidth = Math.round(fitWidth * zoom);

    const rectsByPage = useMemo(() => {
        const map = new Map<number, PdfHighlightRect[]>();
        for (const entry of passage?.pages ?? []) map.set(entry.page, entry.rects);
        return map;
    }, [passage]);

    useEffect(() => {
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useLayoutEffect(() => {
        const node = bodyRef.current;
        if (!node) return;
        const measure = () => setFitWidth(Math.max(240, node.clientWidth - 32));
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [open]);

    useEffect(() => {
        if (!pdfUrl) return;
        let cancelled = false;
        let loaded: PdfDocument | null = null;

        setDoc(null);
        setShape(null);
        setVisible(new Set());
        setError(null);
        setScrolled(false);
        setTargetRendered(false);
        setZoom(1);
        setCurrent(targetPage);
        pageRefs.current.clear();

        (async () => {
            try {
                const pdfjs = await loadPdfjs(pdfjsUrl, pdfjsWorkerUrl);
                if (cancelled) return;

                const pdf = await pdfjs.getDocument({ url: pdfUrl, withCredentials }).promise;
                if (cancelled) { await pdf.destroy(); return; }

                loaded = pdf;
                const first = await pdf.getPage(Math.min(targetPage, pdf.numPages));
                const viewport = first.getViewport({ scale: 1 });
                if (cancelled) return;

                setShape({ width: viewport.width, height: viewport.height });
                setDoc(pdf);

                const start = Math.max(1, targetPage - RENDER_WINDOW);
                const end = Math.min(pdf.numPages, targetPage + RENDER_WINDOW);
                const initial = new Set<number>();
                for (let p = start; p <= end; p++) initial.add(p);
                setVisible(initial);
            } catch (e) {
                if (cancelled) return;
                const message = String((e as Error)?.message || "");
                setError(
                    message.includes("404") || message.toLowerCase().includes("missing")
                        ? "This judgment has no source PDF."
                        : "Could not load the PDF."
                );
            }
        })();

        return () => {
            cancelled = true;
            loaded?.destroy().catch(() => { });
        };
    }, [pdfUrl, targetPage, withCredentials, pdfjsUrl, pdfjsWorkerUrl]);

    const scrollOffsetOf = useCallback((node: HTMLElement): number => {
        const root = scrollRef.current;
        if (!root) return 0;
        return node.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
    }, []);

    const registerPage = useCallback((page: number, node: HTMLDivElement | null) => {
        if (node) pageRefs.current.set(page, node);
        else pageRefs.current.delete(page);
    }, []);

    useEffect(() => {
        if (!doc || !scrollRef.current) return;
        const root = scrollRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                setVisible((prev) => {
                    const next = new Set(prev);
                    let changed = false;
                    for (const entry of entries) {
                        const page = Number((entry.target as HTMLElement).dataset.page);
                        if (!page) continue;
                        if (entry.isIntersecting && !next.has(page)) { next.add(page); changed = true; }
                    }
                    return changed ? next : prev;
                });
            },
            { root, rootMargin: "600px 0px", threshold: 0 }
        );

        for (const node of pageRefs.current.values()) observer.observe(node);
        return () => observer.disconnect();
    }, [doc, shape]);

    useEffect(() => {
        const root = scrollRef.current;
        if (!root || !doc) return;

        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                const middle = root.scrollTop + root.clientHeight / 2;
                let best = 1;
                let bestDistance = Infinity;
                for (const [page, node] of pageRefs.current) {
                    const top = scrollOffsetOf(node);
                    const distance = Math.abs(top + node.clientHeight / 2 - middle);
                    if (distance < bestDistance) { bestDistance = distance; best = page; }
                }
                setCurrent(best);
            });
        };

        root.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            root.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [doc, scrollOffsetOf]);

    useEffect(() => {
        if (scrolled || !targetRendered) return;
        const node = pageRefs.current.get(targetPage);
        const root = scrollRef.current;
        if (!node || !root) return;

        const firstRect = rectsByPage.get(targetPage)?.[0];
        const offsetWithinPage = firstRect ? firstRect[1] * node.clientHeight : 0;
        const top = scrollOffsetOf(node) + offsetWithinPage - root.clientHeight / 3;

        root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        setCurrent(targetPage);
        setScrolled(true);
    }, [scrolled, targetRendered, targetPage, rectsByPage, scrollOffsetOf]);

    const markTargetRendered = useCallback(() => setTargetRendered(true), []);

    const goToPage = useCallback((page: number) => {
        if (!doc) return;
        const clamped = Math.min(Math.max(1, page), doc.numPages);
        setVisible((prev) => new Set(prev).add(clamped));
        setCurrent(clamped);
        requestAnimationFrame(() => {
            const node = pageRefs.current.get(clamped);
            if (node && scrollRef.current) {
                scrollRef.current.scrollTo({ top: Math.max(0, scrollOffsetOf(node) - 8), behavior: "smooth" });
            }
        });
    }, [doc, scrollOffsetOf]);

    const applyZoom = useCallback((next: number) => {
        const root = scrollRef.current;
        const anchor = root ? (root.scrollTop + root.clientHeight / 2) / Math.max(1, root.scrollHeight) : 0;

        setZoom(next);

        requestAnimationFrame(() => {
            if (!root) return;
            const top = anchor * root.scrollHeight - root.clientHeight / 2;
            root.scrollTo({ top: Math.max(0, top) });
        });
    }, []);

    const stepZoom = useCallback((direction: 1 | -1) => {
        const index = ZOOM_STEPS.findIndex((z) => z >= zoom - 0.001);
        const nextIndex = Math.min(Math.max(0, index + direction), ZOOM_STEPS.length - 1);
        applyZoom(ZOOM_STEPS[nextIndex]);
    }, [zoom, applyZoom]);

    useEffect(() => {
        const root = scrollRef.current;
        if (!root) return;
        const onWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            stepZoom(e.deltaY < 0 ? 1 : -1);
        };
        root.addEventListener("wheel", onWheel, { passive: false });
        return () => root.removeEventListener("wheel", onWheel);
    }, [stepZoom]);

    const scale = shape && renderWidth ? renderWidth / shape.width : 1;
    const placeholderHeight = shape ? shape.height * scale : 800;
    const numPages = doc?.numPages ?? 0;

    return (
        <>
            <div
                onClick={onClose}
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
                    open && entered ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label={title || "Cited passage"}
                className={cn(
                    "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-color-surface-neutral-default shadow-2xl transition-transform duration-300 ease-out",
                    "sm:w-[92vw] md:w-[640px] lg:w-[720px]",
                    open && entered ? "translate-x-0" : "translate-x-full",
                    className
                )}
            >
                <header className="flex shrink-0 items-center gap-3 border-b border-color-border-neutral-default px-4 py-3">
                    <p className="min-w-0 flex-1 truncate text-style-textblock-secondary-bodytext-medium text-color-text-neutral-emphasis">
                        {title || "Cited passage"}
                    </p>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle hover:text-color-text-neutral-emphasis focus-visible:outline focus-visible:outline-2 focus-visible:outline-color-border-primary-default"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div ref={bodyRef} className="min-h-0 flex-1">
                    <div ref={scrollRef} className="h-full overflow-auto overscroll-contain bg-color-surface-neutral-subtle p-4">
                        {error ? (
                            <p className="mt-10 text-center text-sm text-color-text-neutral-subtle">{error}</p>
                        ) : !doc ? (
                            <div className="flex h-40 items-center justify-center gap-2 text-sm text-color-text-neutral-subtle">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading judgment…
                            </div>
                        ) : (
                            <div className="flex min-w-fit flex-col items-center gap-3">
                                {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                                    <div key={page} data-page={page} ref={(node) => registerPage(page, node)}>
                                        {visible.has(page) ? (
                                            <RenderedPage
                                                doc={doc}
                                                pageNumber={page}
                                                width={renderWidth}
                                                rects={rectsByPage.get(page)}
                                                onRendered={page === targetPage ? markTargetRendered : undefined}
                                            />
                                        ) : (
                                            <div
                                                className="rounded bg-color-surface-neutral-default"
                                                style={{ width: renderWidth, height: placeholderHeight }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {numPages > 0 && (
                    <footer className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-color-border-neutral-default px-4 py-2">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(current - 1)}
                                disabled={current <= 1}
                                aria-label="Previous page"
                                className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle disabled:opacity-30"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="min-w-[62px] text-center text-xs tabular-nums text-color-text-neutral-subtle">
                                {current} / {numPages}
                            </span>
                            <button
                                onClick={() => goToPage(current + 1)}
                                disabled={current >= numPages}
                                aria-label="Next page"
                                className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle disabled:opacity-30"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="h-4 w-px bg-color-border-neutral-default" />

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => stepZoom(-1)}
                                disabled={zoom <= ZOOM_STEPS[0]}
                                aria-label="Zoom out"
                                className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle disabled:opacity-30"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[46px] text-center text-xs tabular-nums text-color-text-neutral-subtle">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={() => stepZoom(1)}
                                disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
                                aria-label="Zoom in"
                                className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle disabled:opacity-30"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => applyZoom(1)}
                                disabled={zoom === 1}
                                aria-label="Fit to width"
                                className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle disabled:opacity-30"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </button>
                        </div>

                        {passage && (
                            <button
                                onClick={() => { setVisible(prev => new Set(prev).add(targetPage)); setScrolled(false); }}
                                className="rounded border border-color-border-neutral-default px-2 py-1 text-xs text-color-text-neutral-emphasis hover:bg-color-surface-neutral-subtle"
                            >
                                Back to passage
                            </button>
                        )}
                    </footer>
                )}
            </aside>
        </>
    );
};
