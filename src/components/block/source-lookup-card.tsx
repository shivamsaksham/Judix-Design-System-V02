import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { IconButton } from '@/components/ui/icon-button';

export interface SourceLookupCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
    title: string;
    content: React.ReactNode;
    onClose?: () => void;
    onWhyThisClick?: () => void;
    onViewSourceClick?: () => void;
}

export const SourceLookupCard = React.forwardRef<HTMLDivElement, SourceLookupCardProps>(
    ({ title, content, onClose, onWhyThisClick, onViewSourceClick, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col w-[431px] rounded-radius-modal bg-color-surface-neutral-default border border-color-border-neutral-default shadow-lg overflow-hidden",
                    className
                )}
                {...props}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-color-border-neutral-default">
                    <h3 className="p-1 text-style-body-default-regular text-color-text-neutral-default truncate">
                        {title}
                    </h3>
                    <IconButton
                        icon="cross"
                        variant="neutral"
                        size="medium"
                        boundary="none"
                        onClick={onClose}
                        className="text-color-icon-neutral-tertiary h-3 w-3"
                    />
                </div>

                {/* Content */}
                <div className="relative flex flex-col py-2 px-4 flex-1 min-h-0 overflow-hidden">
                    <div className="relative">
                        <div className="p-1 text-style-textblock-secondary-subtext-regular text-color-text-neutral-default leading-relaxed line-clamp-7">
                            {content}
                        </div>
                        {/* Fade out overlay exactly from line 4 to 7 (4 lines * 1.625em line-height) */}
                        <div className="absolute bottom-0 left-0 right-0 h-[6.5em] bg-gradient-to-t from-color-surface-neutral-default via-color-surface-neutral-default/80 to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-2 relative z-10 w-full">
                        <button
                            onClick={onWhyThisClick}
                            className="p-1 text-style-label-default-regular text-color-text-primary-default hover:text-color-text-primary-hover transition-colors"
                        >
                            Why this ?
                        </button>
                        <button
                            onClick={onViewSourceClick}
                            className="p-1 flex items-center gap-1 text-style-label-default-regular text-color-text-primary-default hover:text-color-text-primary-hover transition-colors"
                        >
                            View full source <Icon name="arrow-right-d" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);
SourceLookupCard.displayName = "SourceLookupCard";
