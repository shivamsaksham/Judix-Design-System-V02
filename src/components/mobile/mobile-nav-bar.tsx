'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import ContextWindowDropdown, { ContextItem } from '../block/context-window-dropdown';
import { ChatHistoryMenu, ChatHistoryMenuItem } from '../block/chat-history-menu';
import { Button } from '../ui';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';

export interface MobileNavBarProps {
    variant?: 'default' | 'project';
    onMenuClick?: () => void;
    onBackToResearch?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
    userName?: string;
    className?: string;
    projectName?: string;

    contextItems?: ContextItem[];
    isAutoContext?: boolean;
    onContextItemToggle?: (id: string, checked: boolean) => void;
    onAutoContextChange?: (value: boolean) => void;
    isSessionContextChecked?: boolean;
    onSessionContextToggle?: (checked: boolean) => void;

    ellipsisMenuItems?: ChatHistoryMenuItem[];
}

export function MobileNavBar({
    variant = 'default',
    onMenuClick,
    onBackToResearch,
    onRename,
    onDelete,
    userName = 'User',
    className,
    projectName = "Independent",
    contextItems = [],
    isAutoContext = true,
    onContextItemToggle,
    onAutoContextChange,
    isSessionContextChecked = false,
    onSessionContextToggle,
    ellipsisMenuItems = [],
}: MobileNavBarProps) {
    const [showContextDropdown, setShowContextDropdown] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contextLabelRef = useRef<HTMLDivElement>(null);
    const chatMenuRef = useRef<HTMLDivElement>(null);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            // Allow clicks inside Sheet
            if (target.closest('[role="dialog"]') || target.closest('[data-state="open"]')) {
                return;
            }

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                contextLabelRef.current &&
                !contextLabelRef.current.contains(event.target as Node)
            ) {
                setShowContextDropdown(false);
            }

            if (
                chatMenuRef.current &&
                !chatMenuRef.current.contains(event.target as Node) &&
                ellipsisButtonRef.current &&
                !ellipsisButtonRef.current.contains(event.target as Node)
            ) {
                setShowChatMenu(false);
            }
        };

        if (showContextDropdown || showChatMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showContextDropdown, showChatMenu]);

    const handleContextClick = () => {
        setShowContextDropdown(!showContextDropdown);
    };

    return (
        <nav
            className={cn(
                'flex items-center justify-between',
                'px-4 py-3 ',
                'bg-color-surface-neutral-default',
                'transition-all duration-300 ease-in-out',
                className
            )}
        >
            {/* Left Section: Menu + Logo */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onMenuClick}
                    className="border-none bg-transparent hover:bg-color-surface-neutral-subtle_bg p-2 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Toggle Sidebar"
                >
                    <Image
                        src="/mobile-sidebar.svg"
                        alt="Menu"
                        width={39}
                        height={32}
                    />
                </button>
                <div className="flex items-center">
                    <Image
                        src="/mobile-logo.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Context Label */}
                <div className="relative">
                    <Label
                        ref={contextLabelRef}
                        colorScheme="neutral"
                        size="medium"
                        onClick={handleContextClick}
                        selected={showContextDropdown}
                        className="cursor-pointer"
                    >
                        Context
                    </Label>

                    {/* Context Dropdown as Bottom Sheet */}
                    <Sheet open={showContextDropdown} onOpenChange={setShowContextDropdown}>
                        <SheetContent side="bottom" className="h-[80vh] bg-color-surface-neutral-default border-color-border-neutral-default p-0 flex flex-col">
                            <div className="p-4 border-b border-color-border-neutral-default shrink-0">
                                <SheetTitle className="text-lg font-semibold">Context Window</SheetTitle>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <ContextWindowDropdown
                                    items={contextItems}
                                    defaultAutoContext={isAutoContext}
                                    onItemToggle={onContextItemToggle}
                                    onModeChange={onAutoContextChange}
                                    isSessionContextChecked={isSessionContextChecked}
                                    onSessionContextToggle={onSessionContextToggle}
                                    hideHeader={true}
                                    isMobile={true}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Ellipsis Menu (if items provided) */}
                {ellipsisMenuItems.length > 0 && (
                    <div className="relative">
                        <Button
                            ref={ellipsisButtonRef}
                            onClick={() => setShowChatMenu(!showChatMenu)}
                            variant="neutral"
                            size="small"
                            className='border-none p-2 bg-color-surface-neutral-default m-px gap-1 h-fit'
                            iconClassName="w-5 h-5 p-[2px] relative text-color-icon-neutral-secondary"
                        >
                            <Image
                                src="/ellipsis.svg"
                                alt="Menu"
                                width={20}
                                height={20}
                                aria-label="More options"
                            />
                        </Button>
                        {showChatMenu && (
                            <div
                                ref={chatMenuRef}
                                className="absolute top-full right-0 mt-2 z-50"
                            >
                                <ChatHistoryMenu items={ellipsisMenuItems} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
