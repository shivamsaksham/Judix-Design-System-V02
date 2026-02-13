'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import ContextWindowDropdown, { ContextItem } from './context-window-dropdown';
import { ChatHistoryMenu } from './chat-history-menu';
import { Icon } from 'judix-icon';
import { Button, IconButton } from '../ui';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import Link from 'next/link';

// Hook to detect mobile screen
// removed in favor of prop

export interface NavBarProps {
    variant?: 'default' | 'project';
    onIndependentClick?: () => void;
    onConnectorClick?: () => void;
    onContextClick?: () => void;

    onMenuClick?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
    onBackToResearch?: () => void;
    onMoreOptions?: () => void;
    userName?: string;
    className?: string;
    projectName?: string;

    contextItems?: ContextItem[];
    isAutoContext?: boolean;
    onContextItemToggle?: (id: string, checked: boolean) => void;
    onAutoContextChange?: (value: boolean) => void;
    isSessionContextChecked?: boolean;
    onSessionContextToggle?: (checked: boolean) => void;

    isResultPanelOpen?: boolean;
    isMobile?: boolean;
    isNewChat?: boolean;
}

export function NavBar({
    variant = 'default',
    onIndependentClick,
    onConnectorClick,
    onContextClick,

    onMenuClick,
    onRename,
    onDelete,
    onBackToResearch,
    // onMoreOptions,
    userName = 'User',
    className,
    projectName = "Independent",
    contextItems = [],
    isAutoContext = true,
    onContextItemToggle,
    onAutoContextChange,
    isResultPanelOpen = false,
    isSessionContextChecked = false,
    onSessionContextToggle,
    isNewChat = false,
    isMobile = false,
}: NavBarProps) {
    const [showContextDropdown, setShowContextDropdown] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contextLabelRef = useRef<HTMLDivElement>(null);
    const chatMenuRef = useRef<HTMLDivElement>(null);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

    // Internal isMobile check removed in favor of prop
    // const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            // Allow clicks inside Sheet (which has role=dialog usually)
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
        onContextClick?.();
    };

    return (
        <nav
            className={cn(
                'flex items-center justify-between',
                'px-5 py-[14px]',
                'bg-color-surface-neutral-default',
                'transition-all duration-300 ease-in-out',
                className
            )}
            style={{ paddingRight: !isMobile && isResultPanelOpen ? '450px' : '1.25rem' }}
        >
            {variant === 'project' ? (
                <>
                    <div className="flex items-center gap-2">
                        <div className="md:hidden">
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
                        </div>
                        <Link href="/">
                            <div className="flex items-center cursor-pointer">
                                <Image
                                    src={isMobile ? "/mobile-logo.svg" : "/logo.svg"}
                                    alt="Logo"
                                    width={isMobile ? 32 : 92}
                                    height={32}
                                />
                            </div>
                        </Link>
                    </div>
                    {/* UI FIX REQUIRED */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="neutral"
                            size="small"
                            prefixIcon="back-square"
                            onClick={onBackToResearch}
                            className="border-none bg-transparent hover:bg-color-surface-neutral-subtle_bg"
                        >
                            Back to research
                        </Button>
                        <div className="flex items-center gap-3">
                            {!isMobile && (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-color-surface-neutral-subtle_bg flex items-center justify-center">
                                        <Icon name="Profile" className="w-5 h-5 text-color-icon-neutral-default" />
                                    </div>
                                    <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                                        {userName}
                                    </span>
                                </>
                            )}

                            {isMobile && (
                                <div className="relative">
                                    <Button
                                        ref={ellipsisButtonRef}
                                        onClick={() => setShowChatMenu(!showChatMenu)}
                                        variant="neutral"
                                        size="small"
                                        className='border-none p-2 bg-color-surface-neutral-default m-[1px] gap-1 h-fit'
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
                                            <ChatHistoryMenu
                                                items={[
                                                    {
                                                        id: 'profile',
                                                        label: userName,
                                                        icon: <Icon name="Profile" />,
                                                        onClick: () => {
                                                            setShowChatMenu(false);
                                                        },
                                                    },
                                                ]}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Specialized Mobile Header when Result Panel is open */}
                    {isMobile && isResultPanelOpen ? (
                        <div className="flex items-center justify-between w-full">
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

                            {/* Share and Menu Group */}
                            <div className="flex items-center gap-3 ">
                                {/* Back to Research Button */}
                                {onBackToResearch && (
                                    <Button
                                        onClick={onBackToResearch}
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
                                {onMenuClick && (
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
                                            className="bg-transparent border-none shadow-none hover:bg-transparent text-color-icon-neutral-secondary"
                                        />
                                    </IconButton>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full my-1">
                            <div className="flex items-center gap-2">
                                <div className="md:hidden">
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
                                </div>
                                <div className="flex items-center py-[2.16px] cursor-pointer">
                                    <Image
                                        src={isMobile ? "/mobile-logo.svg" : "/logo.svg"}
                                        alt="Logo"
                                        width={isMobile ? 32 : 92}
                                        height={32}
                                    />
                                </div>
                            </div>

                            {isResultPanelOpen && (
                                <div className="flex items-center gap-2 ml-4 flex-1">
                                    <Button
                                        variant="neutral"
                                        size="small"
                                        prefixIcon="back-square"
                                        onClick={onBackToResearch}
                                        className="border-none bg-transparent hover:bg-color-surface-neutral-subtle_bg"
                                    >
                                        Back to research
                                    </Button>
                                    {!isMobile && projectName && (
                                        <div className="flex items-center gap-2 px-2 py-1 bg-color-surface-neutral-subtle_bg rounded-md">
                                            <Icon name="Cube" className="w-4 h-4 text-color-icon-primary-default" />
                                            <span className="text-style-body-default-medium text-color-text-neutral-default truncate max-w-[150px]">
                                                {projectName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center">


                                <div className="flex items-center  mr-[10px]">
                                    <Image
                                        src="/add-connector.svg"
                                        alt="Add"
                                        className="text-color-icon-primary-default -mr-[3px] cursor-pointer hover:opacity-80 hidden sm:block"
                                        width={41}
                                        height={24}
                                        onClick={onConnectorClick}
                                    />
                                    <Label
                                        colorScheme="primary"
                                        size="medium"
                                        onClick={onIndependentClick}
                                        className="cursor-pointer hover:bg-color-surface-neutral-default relative z-10 bg-color-surface-neutral-default hidden sm:flex"
                                    >
                                        {projectName}
                                    </Label>
                                </div>


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

                                    {isMobile ? (
                                        <Sheet open={showContextDropdown} onOpenChange={setShowContextDropdown}>
                                            <SheetContent side="bottom" className="h-[80vh] bg-color-surface-neutral-default border-color-border-neutral-default p-0 flex flex-col">
                                                <div className="p-4 border-b border-color-border-neutral-default flex-shrink-0">
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
                                    ) : (
                                        showContextDropdown && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute top-full right-0 mt-2 z-50"
                                            >
                                                <ContextWindowDropdown
                                                    items={contextItems}
                                                    defaultAutoContext={isAutoContext}
                                                    onItemToggle={onContextItemToggle}
                                                    onModeChange={onAutoContextChange}
                                                    isSessionContextChecked={isSessionContextChecked}
                                                    onSessionContextToggle={onSessionContextToggle}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>


                                <div className="flex items-center gap-3 ">


                                    {isNewChat && (
                                        <div className="relative">
                                            <Button
                                                ref={ellipsisButtonRef}
                                                onClick={() => setShowChatMenu(!showChatMenu)}
                                                variant="neutral"
                                                size="small"
                                                className='border-none p-2 bg-color-surface-neutral-default m-[1px] gap-1 h-fit'
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
                                                    <ChatHistoryMenu
                                                        items={[
                                                            {
                                                                id: 'rename',
                                                                label: 'Rename',
                                                                icon: <Icon name="Edit2" />,
                                                                onClick: () => {
                                                                    setShowChatMenu(false);
                                                                    onRename?.();
                                                                },
                                                            },

                                                            {
                                                                id: 'delete',
                                                                label: 'Delete',
                                                                icon: <Icon name="Trash" className="text-red-400" />,
                                                                onClick: () => {
                                                                    setShowChatMenu(false);
                                                                    onDelete?.();
                                                                },
                                                                variant: 'danger',
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </nav>
    );
}