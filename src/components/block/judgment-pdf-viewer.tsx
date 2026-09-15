"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Download, Loader2, Minus, Plus, Maximize2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const RENDER_WINDOW = 2;
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
const MIN_PAGE_WIDTH = 200;
const FALLBACK_PAGE_RATIO = 1.294;

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

interface PdfLoadingTask {
    promise: Promise<PdfDocument>;
    destroy: () => Promise<void>;
}

interface PdfjsModule {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (options: { url: string; withCredentials?: boolean }) => PdfLoadingTask;
}

interface LoadError {
    message: string;
    retryable: boolean;
}

let pdfjsPromise: Promise<PdfjsModule> | null = null;

const loadPdfjs = (moduleUrl: string, workerUrl: string): Promise<PdfjsModule> => {
    if (!pdfjsPromise) {
        pdfjsPromise = import(/* webpackIgnore: true */ moduleUrl)
            .then((mod: PdfjsModule) => {
                mod.GlobalWorkerOptions.workerSrc = workerUrl;
                return mod;
            })
            .catch((error: unknown) => {
                pdfjsPromise = null;
                throw error;
            });
    }
    return pdfjsPromise;
};

const errorStatus = (error: unknown): number | undefined => {
    const status = (error as { status?: unknown } | null)?.status;
    return typeof status === "number" ? status : undefined;
};

const toLoadError = (error: unknown): LoadError => {
    const status = errorStatus(error);
    const name = (error as { name?: unknown } | null)?.name;
    const missing = (error as { missing?: unknown } | null)?.missing === true;

    if (status === 401) {
        return { message: "Your session has expired. Sign in again to view this document.", retryable: false };
    }
    if (status === 403) {
        return { message: "You don't have access to this document.", retryable: false };
    }
    if (status === 404 || missing || name === "MissingPDFException") {
        return { message: "The original PDF for this document isn't available.", retryable: false };
    }
    if (name === "InvalidPDFException") {
        return { message: "This file isn't a valid PDF.", retryable: false };
    }
    return { message: "Could not load the PDF. Please try again.", retryable: true };
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
    fallbackHeight,
    rects,
    onRendered,
}: {
    doc: PdfDocument;
    pageNumber: number;
    width: number;
    fallbackHeight: number;
    rects?: PdfHighlightRect[];
    onRendered?: () => void;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        if (!width) return;
        let cancelled = false;
        let task: { cancel: () => void } | null = null;

        (async () => {
            try {
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
                setHeight(viewport.height);

                const render = page.render({
                    canvasContext: context,
                    viewport,
                    transform: dpr === 1 ? null : [dpr, 0, 0, dpr, 0, 0],
                });
                task = render;
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
        <div className="relative bg-white shadow-sm" style={{ width, height: height ?? fallbackHeight }}>
            <canvas ref={canvasRef} className="block h-full w-full" />
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
    onDownload?: () => void | Promise<void>;
    onUnauthorized?: () => Promise<boolean>;
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
    onDownload,
    onUnauthorized,
    pdfjsUrl = "/pdfjs/pdf.min.mjs",
    pdfjsWorkerUrl = "/pdfjs/pdf.worker.min.mjs",
    className,
}: JudgmentPdfViewerProps) => {
    const panelRef = useRef<HTMLElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const authRetryRef = useRef<string | null>(null);

    const [mounted, setMounted] = useState(false);
    const [entered, setEntered] = useState(false);
    const [doc, setDoc] = useState<PdfDocument | null>(null);
    const [shape, setShape] = useState<{ width: number; height: number } | null>(null);
    const [fitWidth, setFitWidth] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [visible, setVisible] = useState<Set<number>>(new Set());
    const [current, setCurrent] = useState(1);
    const [error, setError] = useState<LoadError | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [targetRendered, setTargetRendered] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [downloading, setDownloading] = useState(false);

    const targetPage = passage?.pages[0]?.page ?? passage?.pageNum ?? 1;
    const renderWidth = Math.max(1, Math.round(fitWidth * zoom));
    const isOpen = open && entered;

    const rectsByPage = useMemo(() => {
        const map = new Map<number, PdfHighlightRect[]>();
        for (const entry of passage?.pages ?? []) map.set(entry.page, entry.rects);
        return map;
    }, [passage]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, [mounted]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            e.stopPropagation();
            onClose();
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        const { body } = document;
        const previousOverflow = body.style.overflow;
        body.style.overflow = "hidden";
        return () => {
            body.style.overflow = previousOverflow;
        };
    }, [open]);

    useEffect(() => {
        if (!isOpen) return;
        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        panelRef.current?.focus({ preventScroll: true });
        return () => {
            if (previous?.isConnected) previous.focus({ preventScroll: true });
        };
    }, [isOpen]);

    useLayoutEffect(() => {
        const node = scrollRef.current;
        if (!node) return;
        const measure = () => {
            const styles = window.getComputedStyle(node);
            const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
            setFitWidth(Math.max(MIN_PAGE_WIDTH, Math.floor(node.clientWidth - horizontalPadding)));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [mounted]);

    useEffect(() => {
        if (!pdfUrl) return;
        let cancelled = false;
        let task: PdfLoadingTask | null = null;

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

                task = pdfjs.getDocument({ url: pdfUrl, withCredentials });
                const pdf = await task.promise;
                if (cancelled) return;

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

                if (errorStatus(e) === 401 && onUnauthorized && authRetryRef.current !== pdfUrl) {
                    authRetryRef.current = pdfUrl;
                    const refreshed = await onUnauthorized().catch(() => false);
                    if (cancelled) return;
                    if (refreshed) {
                        setReloadKey((key) => key + 1);
                        return;
                    }
                }

                setError(toLoadError(e));
            }
        })();

        return () => {
            cancelled = true;
            task?.destroy().catch(() => { });
        };
    }, [pdfUrl, targetPage, withCredentials, pdfjsUrl, pdfjsWorkerUrl, reloadKey, onUnauthorized]);

    const retry = useCallback(() => {
        authRetryRef.current = null;
        setReloadKey((key) => key + 1);
    }, []);

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
    }, [stepZoom, mounted]);

    const handleDownload = useCallback(async () => {
        if (!onDownload || downloading) return;
        setDownloading(true);
        try {
            await onDownload();
        } finally {
            setDownloading(false);
        }
    }, [onDownload, downloading]);

    if (!mounted) return null;

    const scale = shape ? renderWidth / shape.width : 1;
    const placeholderHeight = shape ? Math.round(shape.height * scale) : Math.round(renderWidth * FALLBACK_PAGE_RATIO);
    const numPages = doc?.numPages ?? 0;
    const label = title || "Document";

    return createPortal(
        <>
            <div
                onClick={onClose}
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-[1000] bg-black/40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <aside
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                tabIndex={-1}
                className={cn(
                    "fixed right-0 top-0 z-[1001] flex h-dvh w-full max-w-full flex-col bg-color-surface-neutral-default shadow-2xl outline-none transition-transform duration-300 ease-out",
                    "sm:w-[min(92vw,720px)] lg:w-[min(75vw,880px)] 2xl:w-[960px]",
                    isOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
                    className
                )}
            >
                <header className="flex shrink-0 items-center gap-2 border-b border-color-border-neutral-default px-3 py-2.5 sm:px-4 sm:py-3">
                    <p
                        className="min-w-0 flex-1 truncate text-style-textblock-secondary-bodytext-medium text-color-text-neutral-emphasis"
                        title={label}
                    >
                        {label}
                    </p>
                    {onDownload && (
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={downloading || !doc}
                            aria-label="Download PDF"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded border border-color-border-neutral-default px-2 py-1.5 text-xs text-color-text-neutral-emphasis hover:bg-color-surface-neutral-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-color-border-primary-default disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            <span className="hidden sm:inline">Download</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle hover:text-color-text-neutral-emphasis focus-visible:outline focus-visible:outline-2 focus-visible:outline-color-border-primary-default"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div
                    ref={scrollRef}
                    className={cn(
                        "min-h-0 flex-1 overscroll-contain bg-color-surface-neutral-subtle p-2 [scrollbar-gutter:stable] sm:p-4",
                        zoom > 1 ? "overflow-auto" : "overflow-y-auto overflow-x-hidden"
                    )}
                >
                    {error ? (
                        <div className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-3 px-4 text-center">
                            <p className="text-sm text-color-text-neutral-subtle">{error.message}</p>
                            {error.retryable && (
                                <button
                                    type="button"
                                    onClick={retry}
                                    className="inline-flex items-center gap-1.5 rounded border border-color-border-neutral-default px-3 py-1.5 text-xs text-color-text-neutral-emphasis hover:bg-color-surface-neutral-default"
                                >
                                    <RotateCw className="h-3.5 w-3.5" /> Try again
                                </button>
                            )}
                        </div>
                    ) : !doc ? (
                        <div className="flex h-40 items-center justify-center gap-2 text-sm text-color-text-neutral-subtle">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading document…
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
                                            fallbackHeight={placeholderHeight}
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

                {numPages > 0 && (
                    <footer className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-color-border-neutral-default px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
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
                                type="button"
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
                                type="button"
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
                                type="button"
                                onClick={() => stepZoom(1)}
                                disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
                                aria-label="Zoom in"
                                className="rounded p-1.5 text-color-text-neutral-subtle hover:bg-color-surface-neutral-subtle disabled:opacity-30"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
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
                                type="button"
                                onClick={() => { setVisible(prev => new Set(prev).add(targetPage)); setScrolled(false); }}
                                className="rounded border border-color-border-neutral-default px-2 py-1 text-xs text-color-text-neutral-emphasis hover:bg-color-surface-neutral-subtle"
                            >
                                Back to passage
                            </button>
                        )}
                    </footer>
                )}
            </aside>
        </>,
        document.body
    );
};
