'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dropdown, DropdownOption } from '@/components/ui/dropdown';
import { Icon } from '@judix/icon';
export interface ResponseActionsProps {
    onDislike?: () => void;
    onLike?: () => void;
    onRefresh?: () => void;
    onCopy?: () => void;
    onShare?: () => void;
    onExport?: (format: string) => void;
    className?: string;
    isLiked?: boolean;
    isDisliked?: boolean;
    contentToCopy?: string;
}

export const ResponseActions = ({
    onDislike,
    onLike,
    onRefresh,
    onCopy,
    onShare,
    onExport,
    className,
    contentToCopy,
    isLiked: externalIsLiked,
    isDisliked: externalIsDisliked,
}: ResponseActionsProps) => {
    const [internalIsLiked, setInternalIsLiked] = useState(false);
    const [internalIsDisliked, setInternalIsDisliked] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [selectedExport, setSelectedExport] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Use external state if provided, otherwise use internal state
    const isLiked = externalIsLiked !== undefined ? externalIsLiked : internalIsLiked;
    const isDisliked = externalIsDisliked !== undefined ? externalIsDisliked : internalIsDisliked;

    const handleLike = () => {
        if (onLike) {
            onLike();
        } else {
            setInternalIsLiked(!internalIsLiked);
            if (internalIsDisliked) setInternalIsDisliked(false);
        }
    };

    const handleDislike = () => {
        if (onDislike) {
            onDislike();
        } else {
            setInternalIsDisliked(!internalIsDisliked);
            if (internalIsLiked) setInternalIsLiked(false);
        }
    };

    const handleCopy = async () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        if (onCopy) {
            onCopy();
        } else {
            try {
                if (contentToCopy) {
                    await navigator.clipboard.writeText(contentToCopy);
                    showToast.success('Copied to clipboard');
                } else {
                    showToast.alert('No content to copy');
                }
            } catch {
                showToast.alert('Failed to copy');
            }
        }
    };

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            // Default behavior: just log (parent should handle actual refresh)
            console.log('Refresh clicked - implement refresh logic in parent component');
        }
    };

    const handleShare = () => {
        if (onShare) {
            onShare();
        } else {
            console.log('Share clicked');
        }
    };

    const exportOptions: DropdownOption[] = [
        { 
            value: 'pdf', 
            title: 'Export to .pdf',
            leadingIcon: <Icon name="document-download" className="h-[18px] w-[18px]" />
        },
        { 
            value: 'docx', 
            title: 'Export to .docx',
            leadingIcon: <Icon name="document-text-b" className="h-[18px] w-[18px]" />
        },
        { 
            value: 'markdown', 
            title: 'Download markdown',
            leadingIcon: <Icon name="document-code-b" className="h-[18px] w-[18px]" />
        },
    ];

    const handleExportChange = (value: string) => {
        setSelectedExport(value);
        setExportOpen(false);
        if (onExport) {
            onExport(value);
        } else {
            console.log(`Exporting as ${value}`);
        }
    };

    return (
        <TooltipProvider>
            <div
                className={cn(
                    'flex items-center gap-1 p-2',
                    'bg-color-surface-neutral-default',
                    className
                )}
            >
                {/* Dislike Button */}
                <Tooltip>
                    <TooltipTrigger asChild >
                        <IconButton
                            onClick={handleDislike}
                            variant={isDisliked ? "primary" : "neutral"}
                            size="medium"
                            corner="sharp"
                            icon="dislike"
                            aria-label="Dislike"
                        />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Dislike</p>
                    </TooltipContent>
                </Tooltip>

                {/* Like Button */}
                <Tooltip>
                    <TooltipTrigger asChild >

                <IconButton
                    onClick={handleLike}
                    variant={isLiked ? "primary" : "neutral"}
                    size="medium"
                    corner="sharp"
                    icon="like-a"
                    aria-label="Like"
                    />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>Like</p>
                </TooltipContent>
                </Tooltip>

                {/* Refresh Button */}
                <Tooltip>
                    <TooltipTrigger asChild >

                <IconButton
                    onClick={handleRefresh}
                    variant="neutral"
                    size="medium"
                    corner="sharp"
                    icon="refresh-a"
                    aria-label="Refresh"
                />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Refresh</p>
                    </TooltipContent>
                </Tooltip>

                {/* Copy Button */}
                <Tooltip>
                    <TooltipTrigger asChild >
                <IconButton
                    onClick={handleCopy}
                    variant={isCopied ? "primary" : "neutral"}
                    size="medium"
                    corner="sharp"
                    icon={isCopied ? "copy-success" : "copy"}
                    aria-label="Copy"
                />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Copy</p>
                    </TooltipContent>
                </Tooltip>

                {/* Share Button */}
                <Button
                    onClick={handleShare}
                    variant="neutral"
                    size="extraSmall"
                    prefixIcon="share-a"
                    aria-label="Share"
                    className='border-none bg-color-surface-neutral-default text-style-body-default-regular'
                >
                    Share
                </Button>

                {/* Export Button */}
                <Popover open={exportOpen} onOpenChange={setExportOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="neutral"
                            size="extraSmall"
                            prefixIcon="export-d"
                            aria-label="Export"
                            className='border-none bg-color-surface-neutral-default text-style-body-default-regular'
                        >
                            Export
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto border-none shadow-none bg-transparent" align="end" sideOffset={8}>
                        <Dropdown
                            options={exportOptions}
                            value={selectedExport}
                            onChange={handleExportChange}
                            searchbar="off"
                            className="w-[223px] shadow-lg"
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </TooltipProvider>
    );
};
