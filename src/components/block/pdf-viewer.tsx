import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@judix/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
//Add a slide-in right animation in parent
//Add a black overlay to the parent of 50% opacity
export interface PdfViewerProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    onAskAI?: () => void;
    onClose?: () => void;
    file?: string | File | null;
    onLoadSuccess?: (numPages: number) => void;
    children?: React.ReactNode;
}

export const PdfViewer = React.forwardRef<HTMLDivElement, PdfViewerProps>(
    (
        {
            title,
            currentPage,
            totalPages,
            onPageChange,
            onAskAI,
            onClose,
            file,
            onLoadSuccess,
            children,
            className,
            ...props
        },
        ref
    ) => {
        // Prevent default form submissions if inside a form
        const handlePrev = (e: React.MouseEvent) => {
            e.preventDefault();
            if (currentPage > 1) onPageChange?.(currentPage - 1);
        };
        const handleNext = (e: React.MouseEvent) => {
            e.preventDefault();
            if (currentPage < totalPages) onPageChange?.(currentPage + 1);
        };

        const handleInputPage = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1 && val <= totalPages) {
                onPageChange?.(val);
            }
        };

        const renderPagination = () => (
            <>
                <Icon
                    name="arrow-left-c"
                    className={cn("w-5 h-5", currentPage <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer")}
                    onClick={handlePrev}
                />
                <div className="flex items-center gap-1 text-style-body-default-regular text-color-text-neutral-secondary">
                    <span className="p-1">Page</span>
                    {/* Small inline page input */}
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage.toString().padStart(2, "0")}
                        onChange={handleInputPage}
                        className="w-[38px] h-[34px] text-center py-1 px-2 bg-transparent border border-color-border-neutral-default text-color-text-neutral-default focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="p-1 text-sm font-normal font-['Poppins'] leading-4 tracking-tight line-clamp-1">/</span>
                    <span className="p-1 text-sm font-normal font-['Poppins'] leading-4 tracking-tight line-clamp-1">{totalPages}</span>
                </div>

                <Icon
                    name="arrow-right-c"
                    className={cn("w-5 h-5", currentPage >= totalPages ? "opacity-30 cursor-not-allowed" : "cursor-pointer")}
                    onClick={handleNext}
                />
            </>
        );

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col w-[687px] h-[720px] bg-color-surface-neutral-subtle_bg border border-color-border-neutral-default",
                    className
                )}
                {...props}
            >
                {/*  Top Header Bar  */}
                <div className="flex items-center justify-between shrink-0 h-[50px] px-4 py-2 bg-color-surface-neutral-default border-b border-color-border-neutral-default">
                    {/* Left: Document Title */}
                    <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-style-body-default-medium text-color-text-neutral-default truncate max-w-full">
                            <span className="p-1 text-sm font-normal font-['Poppins'] leading-4 tracking-tight line-clamp-1">
                                {title}
                            </span>
                        </h2>
                    </div>

                    {/* Middle / Right cluster */}
                    <div className="flex items-center gap-4">
                        {/* Pagination cluster - Desktop Only */}
                        <div className="hidden md:flex items-center gap-1">
                            {renderPagination()}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6 border-color-border-neutral-default">
                            <Button
                                variant="neutral"
                                size="extraSmall"
                                onClick={onAskAI}
                            >
                                Ask AI
                            </Button>
                            <Icon name="cross" className="w-4 h-4 cursor-pointer" onClick={onClose} />
                        </div>
                    </div>
                </div>

                {/*  Main Canvas  */}
                <div className="flex-1 w-full overflow-auto relative flex flex-col items-center justify-center p-4 bg-color-surface-hover-default">
                    <div
                        className="relative w-[655px] h-[638px] bg-color-surface-neutral-default shadow-sm shrink-0"
                    >
                        {/* Document content injected here */}
                        <div className="absolute inset-0 overflow-hidden text-sm font-['Poppins'] leading-4 tracking-tight text-black pt-[39px] pl-[42px]">
                            {file ? (
                                <Document
                                    file={file}
                                    onLoadSuccess={({ numPages }: { numPages: number }) => onLoadSuccess?.(numPages)}
                                    loading={<div className="flex items-center justify-center p-8 text-color-text-neutral-secondary">Loading PDF...</div>}
                                    error={<div className="flex items-center justify-center p-8 text-color-text-critical-default">Failed to load PDF</div>}
                                >
                                    <Page
                                        pageNumber={currentPage}
                                        width={613}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                    />
                                </Document>
                            ) : (
                                children
                            )}
                        </div>
                    </div>

                    {/* Pagination cluster - Mobile Floating */}
                    <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-color-surface-static-white px-4 py-2 rounded-full shadow-lg border border-color-border-neutral-default z-10">
                        {renderPagination()}
                    </div>
                </div>
            </div>
        );
    }
);
PdfViewer.displayName = "PdfViewer";
