'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Dropdown, DropdownOption } from "@/components/ui/dropdown";

export interface QueryItem {
    id: string;
    text: string;
}

export interface QueryTrackProps {
    queries: QueryItem[];
    type?: string;
    className?: string;
    onQueryClick?: (id: string) => void;
}

export const QueryTrack = ({ queries, type = 'Query track', className, onQueryClick }: QueryTrackProps) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [showLargeBox, setShowLargeBox] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const smallBoxRef = useRef<HTMLDivElement>(null);

    // Limit small box to max 10 lines
    const smallBoxQueries = queries.slice(0, 10);

    // Find the index of the hovered query in small box
    const hoveredIndexInSmallBox = hoveredId ? smallBoxQueries.findIndex(q => q.id === hoveredId) : -1;

    // Convert ALL queries to dropdown options (not limited to 10)
    const dropdownOptions: DropdownOption[] = queries.map(query => ({
        value: query.id,
        title: query.text,
        className: cn(
            "whitespace-nowrap overflow-hidden text-ellipsis hover:!bg-color-surface-neutral-default",
            hoveredId === query.id ? "!text-color-text-neutral-default" : "!text-color-text-neutral-tertiary"
        )
    }));

    // Handle mouse move to detect which option is being hovered
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dropdownRef.current) return;

            const options = dropdownRef.current.querySelectorAll('[role="option"], .option-font-title');
            let foundHover = false;

            options.forEach((option, index) => {
                const rect = option.getBoundingClientRect();
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    setHoveredId(queries[index].id);
                    foundHover = true;
                }
            });

            if (!foundHover && dropdownRef.current.contains(e.target as Node)) {
                // Mouse is in dropdown but not over any option
                // Keep the current hoveredId
            }
        };

        const currentDropdown = dropdownRef.current;
        if (showLargeBox && currentDropdown) {
            currentDropdown.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (currentDropdown) {
                currentDropdown.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [showLargeBox, queries]);

    return (
        <div
            className={`relative flex p-4 min-w-[88px] self-start ${className || ''}`}
            style={{ gap: '33px' }}
            onMouseLeave={() => {
                setShowLargeBox(false);
                setHoveredId(null);
            }}
        >
            {/* Left sidebar with dynamic lines (max 10 lines) */}
            <div
                ref={smallBoxRef}
                className="flex-shrink-0 bg-white flex self-start p-2 w-14 relative z-10"
            >
                <div className="flex flex-col gap-[11px] min-w-10">
                    {smallBoxQueries.map((query, index) => (
                        <div
                            key={query.id}
                            className="py-1 cursor-pointer"
                            onMouseEnter={() => {
                                setShowLargeBox(true);
                                setHoveredId(query.id);
                            }}
                            onClick={() => onQueryClick?.(query.id)}
                        >
                            <div
                                className={cn(
                                    "h-0 border-t rounded transition-all duration-200",
                                    hoveredIndexInSmallBox === index ? "w-[40px] border-color-border-neutral-strong" : "w-[20px] border-color-border-neutral-default"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content area using Dropdown component - positioned overlapping small box */}
            <div
                ref={dropdownRef}
                className={cn(
                    "absolute left-14 top-0 transition-opacity duration-200 z-20",
                    "[&_.space-y-1]:max-h-[80vh] [&_.space-y-1]:overflow-y-auto",
                    showLargeBox ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onMouseEnter={() => setShowLargeBox(true)}
            >
                <Dropdown
                    options={dropdownOptions}
                    value={null}
                    onChange={(value) => {
                        setHoveredId(value);
                        onQueryClick?.(value);
                    }}
                    searchbar="off"
                    className="w-[300px]"
                />
            </div>
        </div>
    );
};
