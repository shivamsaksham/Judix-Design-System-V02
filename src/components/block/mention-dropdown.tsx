'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Option } from '@/components/ui/option';
import { Icon } from '@judix/icon';

export interface MentionOption {
    value: string;
    title: string;
    subtext?: React.ReactNode;
    leadingIcon?: React.ComponentProps<typeof Icon>['name'];
}

export interface MentionDropdownProps {
    options: MentionOption[];
    /** Currently keyboard-highlighted index */
    activeIndex?: number | null;
    /** Called when an option is selected */
    onChange: (option: MentionOption) => void;
    className?: string;
}

export function MentionDropdown({
    options,
    activeIndex,
    onChange,
    className,
}: MentionDropdownProps) {
    return (
        <div
            className={cn(
                'min-w-[200px] max-w-[365px] w-max',
                'bg-dropdown-color-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default',
                className
            )}
        >
            <div className="p-2 space-y-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {options.length > 0 ? (
                    options.map((option, idx) => (
                        <Option
                            key={option.value}
                            title={option.title}
                            subtext={option.subtext}
                            prefixSlot={
                                option.leadingIcon ? (
                                    <Icon
                                        name={option.leadingIcon}
                                        className="w-5 h-5 shrink-0 text-color-icon-neutral-default"
                                    />
                                ) : undefined
                            }
                            selected={false}
                            highlighted={activeIndex === idx}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                onChange(option);
                            }}
                        />
                    ))
                ) : (
                    <div className="px-2 py-3 text-center text-style-body-default-regular text-color-text-neutral-secondary">
                        No results found.
                    </div>
                )}
            </div>
        </div>
    );
}
