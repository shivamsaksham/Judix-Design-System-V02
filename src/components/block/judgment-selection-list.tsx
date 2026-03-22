import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { JudgmentTile, JudgmentTileProps } from './judgment-tile';

export interface JudgmentSelectionListProps {
    className?: string;
    judgments: JudgmentTileProps[];
    isConfirmed?: boolean;
    isExpanded?: boolean;
    selectedIndex?: number | null;
    onToggleExpand?: (expanded: boolean) => void;
    onSelect?: (index: number) => void;
    onConfirm?: () => void;
    onReject?: () => void;
    onManualSearch?: (query: string) => void;
    defaultShowManualInput?: boolean;
}

export const JudgmentSelectionList = ({
    className,
    judgments = [],
    isConfirmed: isConfirmedProp = false,
    isExpanded: isExpandedProp,
    selectedIndex: selectedIndexProp,
    onToggleExpand,
    onSelect,
    onConfirm,
    onReject,
    onManualSearch,
    defaultShowManualInput = false,
}: JudgmentSelectionListProps) => {

    // Internal state handling in case it's uncontrolled
    const [internalExpanded, setInternalExpanded] = useState(!isConfirmedProp);
    const [internalSelectedIndex, setInternalSelectedIndex] = useState<number | null>(null);
    const [showManualInput, setShowManualInput] = useState(defaultShowManualInput);
    const [manualQuery, setManualQuery] = useState('');
    const [internalConfirmed, setInternalConfirmed] = useState(isConfirmedProp);

    React.useEffect(() => {
        setInternalConfirmed(isConfirmedProp);
        if (isConfirmedProp) {
            setInternalExpanded(false);
        }
    }, [isConfirmedProp]);


    const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;
    const selectedIndex = selectedIndexProp !== undefined ? selectedIndexProp : internalSelectedIndex;
    const isConfirmed = internalConfirmed;

    const handleToggle = () => {
        const next = !isExpanded;
        setInternalExpanded(next);
        onToggleExpand?.(next);
    };

    const handleSelect = (idx: number) => {
        if (isConfirmed) return; // Don't allow changing selection if already confirmed
        setInternalSelectedIndex(idx);
        onSelect?.(idx);
    };

    const handleReject = () => {
        setShowManualInput(true);
        setInternalExpanded(false);
        onToggleExpand?.(false);
        onReject?.();
    };

    const handleConfirm = () => {
        setInternalConfirmed(true);
        setInternalExpanded(false);
        onToggleExpand?.(false);
        onConfirm?.();
    };

    const handleManualSearch = () => {
        onManualSearch?.(manualQuery);
    };

    return (
        <div
            className={cn(
                'w-full rounded-radius-modal border border-color-border-neutral-default bg-color-surface-neutral-default overflow-hidden flex flex-col',
                className
            )}
        >
            {/* Header Row */}
            <div
                className={cn(
                    "flex items-center justify-between p-4 cursor-pointer select-none",
                    isExpanded && 'border-b border-color-border-neutral-default'
                )}
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <span className="p-1 text-style-label-default-regular text-color-text-neutral-secondary">
                        Found <span className="text-color-text-feedback-warning-default">{judgments.length} matching judgments</span> - select the one you mean
                    </span>

                    {isConfirmed && (
                        <span className="p-1 text-style-label-default-regular text-color-text-feedback-success-default ml-2">
                            Confirmed
                        </span>
                    )}
                </div>
                <Icon
                    name={isExpanded ? 'arrow-up-a' : 'arrow-down-c'}
                    className="w-4 h-4 text-color-text-neutral-secondary"
                />
            </div>

            {/* Expanded Body */}
            {isExpanded && (
                <div className="flex flex-col">

                    {/* The list of judgment tiles */}
                    <div className="flex flex-col bg-color-surface-neutral-default">
                        {judgments.map((judgment, idx) => {
                            // Determine selection state logic
                            let tileState: 'default' | 'selected' | 'unselected' = 'default';

                            if (selectedIndex !== null) {
                                tileState = selectedIndex === idx ? 'selected' : 'unselected';
                            }

                            return (
                                <div key={idx} className={cn("border-b border-color-border-neutral-default last:border-b-0")}>
                                    <JudgmentTile
                                        {...judgment}
                                        selectionState={tileState}
                                        onClick={() => handleSelect(idx)}
                                        className="border-0 rounded-none bg-transparent"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Footer */}
                    {!isConfirmed && (
                        <div className="p-4 bg-color-surface-neutral-default flex items-center gap-2 border-t border-color-border-neutral-default">
                            <Button
                                size="extraSmall"
                                variant="primary"
                                onClick={handleConfirm}
                                disabled={selectedIndex === null}
                            >
                                Confirm and proceed
                            </Button>
                            <Button size="extraSmall" variant="neutral" onClick={handleReject}>
                                None of these
                            </Button>
                        </div>
                    )}

                </div>
            )}

            {showManualInput && (
                <div className={cn(
                    "p-4 bg-color-surface-neutral-default flex items-center gap-2",
                    isExpanded && "border-t border-color-border-neutral-default"
                )}>
                    <TextInput
                        placeholder="Type the full case name or case number"
                        value={manualQuery}
                        onChange={(e) => setManualQuery(e.target.value)}
                        className="grow h-[42px]"
                        inputClassName="placeholder:text-[13px] py-1"
                        inputSize="small"
                    />
                    <Button
                        variant="primary"
                        size="small"
                        onClick={handleManualSearch}
                        className="h-[42px] px-6"
                    >
                        Search
                    </Button>
                </div>
            )}
        </div>
    );
};
