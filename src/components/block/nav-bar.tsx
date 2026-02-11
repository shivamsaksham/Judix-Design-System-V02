'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import ContextWindowDropdown from './context-window-dropdown';
import { IconButton } from '../ui/icon-button';
import { Button } from '../ui';

export interface NavBarProps {
    onIndependentClick?: () => void;
    onContextClick?: () => void;
    onShareClick?: () => void;
    onMenuClick?: () => void;
    showBackToResearch?: boolean;
    showMenu?: boolean;
    className?: string;
}

export default function NavBar({
    onIndependentClick,
    onContextClick,
    onShareClick,
    onMenuClick,
    showBackToResearch = false,
    showMenu = true,
    className,
}: NavBarProps) {
    const [showContextDropdown, setShowContextDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contextLabelRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                contextLabelRef.current &&
                !contextLabelRef.current.contains(event.target as Node)
            ) {
                setShowContextDropdown(false);
            }
        };

        if (showContextDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showContextDropdown]);

    const handleContextClick = () => {
        setShowContextDropdown(!showContextDropdown);
        onContextClick?.();
    };

    const contextWindowItems = [
        {
            id: '1',
            title: 'Deepak Singh Alias vs Mukesh Kumar & Ors',
            description: '2024 3 SCR 231',
            checked: false,
        },
        {
            id: '2',
            title: 'Query #1',
            description: 'This is the demo summary of the first query of the session. This is the demo summary of the first query',
            checked: false,
        },
        {
            id: '3',
            title: 'Deepak Singh Alias vs Mukesh Kumar & Ors',
            description: '2024 2 SCR 472',
            checked: false,
        },
        {
            id: '4',
            title: 'Indian Penal Code, 1961',
            description: 'Section 498A, 499',
            checked: false,
        },
        {
            id: '5',
            title: 'Query #2',
            description: 'This is the demo summary of the first query of the session. This is the demo summary of the first query',
            checked: false,
        },
    ];

    return (
        <nav
            className={cn(
                'flex items-center justify-between',
                'px-5 py-[14px]',
                'bg-color-surface-neutral-default',
                className
            )}
        >
            <div className="flex items-center justify-between w-full my-[6px]">
                {/* Left Section - Logo */}
                <div className="flex items-center py-[2.16px] cursor-pointer">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={85}
                        height={26}
                        className="p-[3.6px]"
                    />
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center">

                    <div className="flex items-center  mr-[10px]">
                        <Image src="/add-connector.svg" alt="Add" className="text-color-icon-primary-default -mr-[3px]" width={41} height={24} />
                        <Label
                            colorScheme="primary"
                            size="medium"
                            onClick={onIndependentClick}
                            className="cursor-pointer hover:bg-color-surface-neutral-default relative z-10 bg-color-surface-neutral-default"
                        >
                            Independent
                        </Label>
                    </div>


                    {/* Context Label */}
                    <div className="relative">
                        <Label
                            ref={contextLabelRef}
                            colorScheme="neutral"
                            size="medium"
                            onClick={handleContextClick}
                            selected={showContextDropdown}
                            className="cursor-pointer mr-6"
                        >
                            Context
                        </Label>

                        {/* Context Window Dropdown */}
                        {showContextDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute top-full right-0 mt-2 z-50"
                            >
                                <ContextWindowDropdown
                                    items={contextWindowItems}
                                />
                            </div>
                        )}
                    </div>


                    {/* Share and Menu Group */}
                    <div className="flex items-center gap-3 ">
                        {/* Back to Research Button */}
                        {showBackToResearch && (
                            <Button
                                onClick={onShareClick}
                                variant="neutral"
                                size="small"
                                prefixIcon="back-square"
                                className='border-none p-0 bg-color-surface-neutral-default m-[1px] gap-1'
                                iconClassName="w-5 h-5 relative text-color-icon-neutral-secondary"
                            >
                                <span className="p-1 text-style-body-default-regular">Back to Research</span>
                            </Button>
                        )}

                        {/* Three Dot Menu */}
                        {showMenu && (
                            <IconButton
                                onClick={onMenuClick}
                                variant="neutral"
                                size="medium"
                                corner='sharp'
                                className="border-none p-2 bg-transparent hover:bg-color-surface-neutral-hover_default m-[1px] h-fit"
                            >
                                <Image
                                    src="/ellipsis.svg"
                                    alt="Menu"
                                    width={20}
                                    height={20}
                                    aria-label="More options"
                                />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
