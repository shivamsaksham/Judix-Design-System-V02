import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { IconButton } from '@/components/ui/icon-button';

export interface FileUploadItemProps extends React.HTMLAttributes<HTMLDivElement> {
    fileName: string;
    fileSize: string;
    state: 'processing' | 'processed' | 'failed';
    progress?: number; 
    subtitle?: string; 
    onRemove?: () => void;
    onRetry?: () => void;
}

export const FileUploadItem = React.forwardRef<HTMLDivElement, FileUploadItemProps>(
    ({ fileName, fileSize, state, progress = 0, subtitle, onRemove, onRetry, className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("w-full flex flex-col relative", className)} {...props}>
                {/* Header Section */}
                <div className="flex items-start gap-3 w-full">
                    <Icon name="document-text-b" className="w-5 h-5 text-color-icon-neutral-secondary shrink-0 mt-0.5" />
                    
                    <div className="flex flex-col w-full min-w-0">
                        {/* Name and Cross Row */}
                        <div className="flex items-start justify-between w-full">
                            <span className="p-1 text-style-body-default-regular text-color-neutral-default truncate">{fileName}</span>
                            {onRemove && (
                                <IconButton 
                                    icon="cross" 
                                    variant="neutral" 
                                    boundary="none" 
                                    size="medium"
                                    className="w-6 h-6 p-1 text-color-icon-neutral-tertiary hover:text-color-icon-neutral-default shrink-0 -mr-1"
                                    onClick={onRemove} 
                                />
                            )}
                        </div>
                        <span className="text-style-label-default-regular text-color-text-neutral-tertiary p-1 pr-6">{fileSize}</span>
                    </div>
                </div>

                {/* Processing Progress Line (Full Width) */}
                {state === 'processing' && (
                    <div className="h-[2px] w-full bg-color-border-neutral-default my-1 overflow-hidden relative rounded-full">
                        <div 
                            className="absolute top-0 left-0 h-full bg-color-border-brand-primary transition-all duration-300" 
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        />
                    </div>
                )}

                {/* Status Text Section (Indented to align with text) */}
                <div className="flex w-full pl-8"> 
                    {state === 'processing' && (
                        <span className="p-1 text-style-label-default-regular text-color-text-brand-primary">Processing</span>
                    )}
                    {state === 'processed' && subtitle && (
                        <span className="p-1 text-style-label-default-regular italic text-color-text-primary-default">
                            {subtitle}
                        </span>
                    )}
                    {state === 'failed' && (
                        <div className="flex items-center gap-3">
                            <span className="p-1 text-style-label-default-regular text-color-text-feedback-error-default">Failed</span>
                            <div 
                                className="p-1 flex items-center gap-2 cursor-pointer text-style-label-default-regular text-color-text-neutral-tertiary"
                                onClick={onRetry}
                            >
                                <span>Retry</span>
                                <Icon name="refresh-a" className="w-3 h-3" /> 
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
FileUploadItem.displayName = 'FileUploadItem';
