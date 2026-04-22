import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Button } from '@/components/ui/button';

export interface ProNudgeProps {
    className?: string;
    onYesClick?: () => void;
    onNoClick?: () => void;
}

export const ProNudge = ({
    className,
    onYesClick,
    onNoClick,
}: ProNudgeProps) => {
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    const [accepted, setAccepted] = React.useState(false);

    const handleYes = () => {
        setIsConfirmed(true);
        setAccepted(true);
        onYesClick?.();
    };

    const handleNo = () => {
        setIsConfirmed(true);
        setAccepted(false);
        onNoClick?.();
    };

    if (isConfirmed) {
        return (
            <div className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border border-color-border-neutral-default bg-color-surface-neutral-default text-color-text-neutral-secondary', className)}>
                <Icon name={accepted ? "tick-circle" : "close-circle"} className={cn("w-4 h-4", accepted ? "text-color-text-feedback-success-default" : "text-color-text-neutral-tertiary")} />
                <span className='p-1 text-style-body-default-emphasis'>{accepted ? "Switched to Judix-pro v1.6" : "Continuing with current model"}</span>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 pb-4 px-4 md:py-2 rounded-lg border border-color-border-neutral-default bg-color-surface-neutral-default w-[369px] md:w-[1003px]',
                className
            )}
        >
            <div className="flex items-start gap-2">
                <Icon name="crown-a" className="w-5 h-5 py-1 text-color-icon-neutral-default shrink-0 mt-0.5 md:mt-0" />
                <div className="flex flex-col">
                    <span className="p-1 text-style-body-default-emphasis text-color-text-primary-default">
                        Pro handles this better. Use Judix-pro v1.6 for this query ?
                    </span>
                    <span className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-secondary">
                        Complex judgment retrieval is 40% more accurate on pro model
                    </span>
                    {/* Mobile buttons */}
                    <div className="flex md:hidden items-center gap-2 mt-2">
                        <Button size="extraSmall" variant="primary" onClick={handleYes}>
                            Yes
                        </Button>
                        <Button size="extraSmall" variant="neutral" onClick={handleNo}>
                            No
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
                <Button size="extraSmall" variant="primary" onClick={handleYes}>
                    Yes
                </Button>
                <Button size="extraSmall" variant="neutral" onClick={handleNo}>
                    No
                </Button>
            </div>
        </div>
    );
};
