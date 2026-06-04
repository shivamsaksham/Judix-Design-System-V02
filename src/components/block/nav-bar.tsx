'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile-query';
import Image from 'next/image';
import type { ContextItem } from './context-window-dropdown';
import { ChatHistoryMenu } from './chat-history-menu';
import { Icon } from 'judix-icon';
import { Button, Skeleton } from '../ui';
import Link from 'next/link';

export interface NavBarProps {
    variant?: 'default' | 'project' | 'secondary';
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
    chatName?: string;
}

const LogoText = ({ isMobile = false }: { isMobile?: boolean }) => (
    <Link href="/">
        <div className="flex items-center cursor-pointer gap-[6px]">
            {!isMobile && (
                <Image
                    src="/mobile-logo.svg"
                    alt="Icon"
                    width={22}
                    height={22}
                    style={{ height: 'auto' }}
                    priority
                />
            )}
            <Image
                src="/judix.svg"
                alt="Logo"
                width={53}
                height={16}
                style={{ height: 'auto' }}
                priority
            />
        </div>
    </Link>
);

/**
 * User Profile Badge
 */
const UserBadge = ({ name }: { name: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-color-surface-neutral-subtle_bg flex items-center justify-center">
            <Icon name="Profile" className="w-5 h-5 text-color-icon-neutral-default" />
        </div>
        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
            {name}
        </span>
    </div>
);

export function NavBar({
    variant = 'default',
    onIndependentClick,
    onConnectorClick,
    onContextClick,
    onMenuClick,
    onRename,
    onDelete,
    onBackToResearch,
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
    chatName,
    isMobile: isMobileProp,
}: NavBarProps) {
    const isMobileDevice = useMediaQuery("(max-width: 1024px)");
    const isMobile = isMobileProp ?? isMobileDevice;

    const [showChatMenu, setShowChatMenu] = useState(false);
    const chatMenuRef = useRef<HTMLDivElement>(null);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (target.closest('[role="dialog"]') || target.closest('[data-state="open"]')) return;

            if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node) &&
                ellipsisButtonRef.current && !ellipsisButtonRef.current.contains(event.target as Node)) {
                setShowChatMenu(false);
            }
        };

        if (showChatMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showChatMenu]);

    // Sub-renderers for clean structure
    const renderMobileSidebarTrigger = () => (
        <div className="md:hidden">
            <button
                onClick={onMenuClick}
                className="border-none bg-transparent hover:bg-color-surface-neutral-subtle_bg p-2 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Toggle Sidebar"
            >
                <Image src="/mobile-sidebar.svg" alt="Menu" width={19} height={13} />
            </button>
        </div>
    );

    const renderMoreOptions = (items: any[]) => (
        <div className="relative">
            <Button
                ref={ellipsisButtonRef}
                onClick={() => setShowChatMenu(!showChatMenu)}
                variant="neutral"
                size="small"
                className='border-none p-2 bg-color-surface-neutral-default m-px gap-1 h-fit'
                iconClassName="w-5 h-5 p-[2px] relative text-color-icon-neutral-secondary"
            >
                <Image src="/ellipsis.svg" alt="Menu" width={20} height={20} aria-label="More options" style={{ height: 'auto' }}/>
            </Button>
            {showChatMenu && (
                <div ref={chatMenuRef} className="absolute top-full right-0 mt-2 z-50">
                    <ChatHistoryMenu items={items} />
                </div>
            )}
        </div>
    );

    return (
        <nav
            className={cn(
                'flex items-center justify-between px-4 py-2 lg:py-3 h-[64px] bg-color-surface-neutral-default transition-all duration-300 ease-in-out',
                className
            )}
            style={{ paddingRight: !isMobile && isResultPanelOpen ? '450px' : '1.25rem' }}
        >
            {variant === 'secondary' && (
                <div className="flex items-center gap-2">
                    {renderMobileSidebarTrigger()}
                    <LogoText isMobile={true} />
                </div>
            )}

            {variant === 'project' && (
                <>
                    <div className="flex items-center gap-2">
                        {renderMobileSidebarTrigger()}
                        <LogoText isMobile={isMobile} />
                    </div>
                    <div className="flex items-center gap-2">
                        {!isMobile ? (
                            <UserBadge name={userName} />
                        ) : (
                            renderMoreOptions([
                                {
                                    id: 'profile',
                                    label: userName,
                                    icon: <Icon name="Profile" />,
                                    onClick: () => setShowChatMenu(false),
                                },
                            ])
                        )}
                    </div>
                </>
            )}

            {variant === 'default' && (
                <>
                    {isMobile ? (
                        <div className="flex items-center justify-between w-full">
                            <div className={cn(
                                "flex items-center overflow-hidden flex-1",
                                projectName !== 'Independent' || (!isNewChat && chatName) ? "gap-2" : "gap-4"
                            )}>
                                {renderMobileSidebarTrigger()}
                                {projectName !== 'Independent' ? (
                                    <div className="flex items-center overflow-hidden max-w-[calc(100vw-120px)] sm:max-w-[calc(100vw-160px)] text-style-body-title-regular">
                                        <span className="py-1 text-color-text-primary-default truncate shrink-0 max-w-[120px]">
                                            {projectName}
                                        </span>
                                        {!isNewChat && (
                                            <>
                                                <span className="text-color-text-neutral-tertiary shrink-0">/</span>
                                                {chatName ? (
                                                    <span className="py-1 text-style-body-title-regular text-color-text-neutral-default truncate">
                                                        {chatName}
                                                    </span>
                                                ) : (
                                                    <Skeleton className="h-4 w-24 shrink-0 ml-1" />
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    !isNewChat && chatName ? (
                                        <span className="p-1 text-style-body-title-regular text-color-text-neutral-default truncate">
                                            {chatName}
                                        </span>
                                    ) : (
                                        <LogoText isMobile={true} />
                                    )
                                )}
                            </div>

                            <div className="flex items-center shrink-0 ml-2">
                                {!isNewChat && chatName && renderMoreOptions([
                                    {
                                        id: 'rename',
                                        label: 'Rename',
                                        icon: <Icon name="Edit2" />,
                                        onClick: () => { setShowChatMenu(false); onRename?.(); },
                                    },
                                    {
                                        id: 'delete',
                                        label: 'Delete',
                                        icon: <Icon name="Trash" className="text-red-400" />,
                                        onClick: () => { setShowChatMenu(false); onDelete?.(); },
                                        variant: 'danger',
                                    },
                                ])}
                            </div>
                        </div>
                    ) : (
                        /* Standard default header (Desktop) */
                        <div className="flex items-center justify-between w-full">
                            <div className={cn(
                                "flex items-center overflow-hidden flex-1",
                                projectName !== 'Independent' || (!isNewChat && chatName) ? "gap-2" : "gap-4"
                            )}>
                                {projectName !== 'Independent' ? (
                                    <div className="flex items-center overflow-hidden max-w-[calc(100vw-300px)] text-style-body-title-regular">
                                        <span className="py-1 text-color-text-primary-default truncate shrink-0 max-w-[200px]">
                                            {projectName}
                                        </span>
                                        {!isNewChat && (
                                            <>
                                                <span className="text-color-text-neutral-tertiary shrink-0">/</span>
                                                {chatName ? (
                                                    <span className="py-1 text-style-body-title-regular text-color-text-neutral-default truncate">
                                                        {chatName}
                                                    </span>
                                                ) : (
                                                    <Skeleton className="h-4 w-32 shrink-0 ml-1" />
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    !isNewChat && chatName ? (
                                        <span className="p-1 text-style-body-title-regular text-color-text-neutral-default truncate">
                                            {chatName}
                                        </span>
                                    ) : (
                                        <LogoText isMobile={false} />
                                    )
                                )}
                            </div>

                            <div className="flex items-center shrink-0 ml-2">
                                {!isNewChat && chatName && renderMoreOptions([
                                    {
                                        id: 'rename',
                                        label: 'Rename',
                                        icon: <Icon name="Edit2" />,
                                        onClick: () => { setShowChatMenu(false); onRename?.(); },
                                    },
                                    {
                                        id: 'delete',
                                        label: 'Delete',
                                        icon: <Icon name="Trash" className="text-color-icon-feedback-error-default" />,
                                        onClick: () => { setShowChatMenu(false); onDelete?.(); },
                                        variant: 'danger',
                                    },
                                ])}
                            </div>
                        </div>
                    )}
                </>
            )}
        </nav>
    );
}