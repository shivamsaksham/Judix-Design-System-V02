'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { HistoryTile } from './history-tile';
import { SidebarActionButtons } from './sidebar-action-buttons';
import { ChatHistorySection } from './chat-history-section';
import { ChatHistoryMenu } from './chat-history-menu';
import { UserMenu } from './user-menu';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '../ui';
import { IconButton } from '../ui/icon-button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Confirmation from './confirmation';
import { ShareSearchDialog } from './share-search-dialog';

export interface ChatHistoryItem {
    id: string;
    title: string;
    onClick?: () => void;
}

export interface UsageStats {
    current: number;
    total: number;
    label: string;
}

export interface UserProfile {
    name: string;
    tier: string;
    avatar?: React.ReactNode;
}

export interface HistorySidebarProps {
    chatHistory: ChatHistoryItem[];
    usageStats: UsageStats;
    userProfile: UserProfile;
    onNewChat?: () => void;
    onNotes?: () => void;
    onProjects?: () => void;
    onResetChat?: () => void;
    onUpgrade?: () => void;
    onRename?: (chatId: string) => void;
    onShare?: (chatId: string) => void;
    onMove?: (chatId: string) => void;
    onDelete?: (chatId: string) => void;
    activeChatId?: string;
    className?: string;
    isExpanded?: boolean;
    onToggleSidebar?: () => void;
}

export const HistorySidebar = ({
    chatHistory,
    usageStats,
    userProfile,
    onNewChat,
    onNotes,
    onProjects,
    onResetChat,
    onUpgrade,
    onRename,
    onShare,
    onMove,
    onDelete,
    activeChatId,
    className,
    isExpanded: controlledIsExpanded,
    onToggleSidebar,
}: HistorySidebarProps) => {
    const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, left: 0 });
    const [internalIsExpanded, setInternalIsExpanded] = useState(false);
    const [deleteConfirmationChatId, setDeleteConfirmationChatId] = useState<string | null>(null);
    const [shareChatId, setShareChatId] = useState<string | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const userNameRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded;

    const handleToggle = () => {
        if (onToggleSidebar) {
            onToggleSidebar();
        } else {
            setInternalIsExpanded(!internalIsExpanded);
        }
    };

    // ... useEffect ...

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuChatId(null);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (openMenuChatId || isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuChatId, isUserMenuOpen]);

    const handleMenuClick = (chatId: string, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom,
            left: rect.left,
        });
        setOpenMenuChatId(chatId);
    };

    const handleMenuAction = (action: 'rename' | 'share' | 'move' | 'delete', chatId: string) => {
        setOpenMenuChatId(null);
        if (action === 'rename' && onRename) onRename(chatId);
        if (action === 'share') setShareChatId(chatId);
        if (action === 'move' && onMove) onMove(chatId);
        if (action === 'delete') {
            setDeleteConfirmationChatId(chatId);
        }
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmationChatId && onDelete) {
            onDelete(deleteConfirmationChatId);
        }
        setDeleteConfirmationChatId(null);
    };

    return (
        <div
            className={cn(
                'flex flex-col h-screen overflow-hidden',
                isExpanded ? 'w-[256px]' : 'w-[56px]',
                'bg-dropdown-color-bg border-r border-dropdown-color-stroke',
                !isExpanded,
                className
            )}
            style={{
                transition: 'width 350ms ease-in-out',
                willChange: 'width'
            }}
        >
            {isExpanded ? (
                <>
                    <div className="flex items-center justify-between px-3 pt-4 pb-2 border-b border-dropdown-color-stroke -mb-px">
                        <IconButton
                            onClick={handleToggle}
                            icon="sidebar-left"
                            variant="neutral"
                            size="medium"
                            corner="sharp"
                            className="bg-color-neutral-default hover:bg-option-color-hover transition-colors sidebar-fade-in-left"
                            iconClassName='text-icon_button-color-neutral-icon'
                            aria-label="Toggle Sidebar"
                        />
                        <Label
                            colorScheme="neutral"
                            size="small"
                            onClick={onResetChat}
                            className="cursor-pointer whitespace-nowrap sidebar-fade-in-right"
                        >
                            Reset Chat
                        </Label>
                    </div>

                    <SidebarActionButtons
                        onNewChat={onNewChat}
                        onNotes={onNotes}
                        onProjects={onProjects}
                        className="sidebar-fade-in-up-1"
                    />

                    <ChatHistorySection
                        chatHistory={chatHistory}
                        activeChatId={activeChatId}
                        onMenuClick={handleMenuClick}
                        className="ml-1 mr-3"
                    />

                    <div className="px-2 py-3 border-t border-dropdown-color-stroke sidebar-fade-in-up-2">
                        <div className="flex items-center gap-2 mb-3 ">
                            <span className=" p-1 
                                            text-style-body-default-regular
                                            text-color-text-neutral-default">Usage</span>
                            <Icon name="info-circle" className="text-color-icon-neutral-tertiary w-4 h-4" />
                        </div>
                        <div className="w-full 
                                        bg-button-color-neutral-disabled-stroke 
                                        rounded-full h-2 mb-1">
                            <div
                                className="
                                        bg-color-text-primary-default
                                        h-2
                                        rounded-full transition-all"
                                style={{ width: `${(usageStats.current / usageStats.total) * 100}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between min-w-0">
                            <span className="text-color-text-neutral-tertiary p-1 text-style-label-title-regular whitespace-nowrap">{usageStats.label}</span>
                            <span className="text-color-text-neutral-tertiary text-style-label-title-regular p-1 whitespace-nowrap">
                                {usageStats.current}/{usageStats.total}
                            </span>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="py-3 px-2 border-t border-dropdown-color-stroke sidebar-fade-in-um-3">
                        <div
                            className="flex items-center justify-between cursor-pointer rounded-lg transition-colors"
                            onClick={(e) => {
                                const containerRect = e.currentTarget.getBoundingClientRect();
                                const userNameRect = userNameRef.current?.getBoundingClientRect();
                                // Calculate bottom distance so menu's bottom aligns with userName box's bottom
                                const bottomDistance = userNameRect ? window.innerHeight - userNameRect.bottom : window.innerHeight - containerRect.bottom;
                                setUserMenuPosition({
                                    top: bottomDistance,
                                    //fix left
                                    left: userNameRect ? userNameRect.right + 0 : containerRect.left + 8,
                                });
                                setIsUserMenuOpen(!isUserMenuOpen);
                            }}
                        >
                            <div className="flex items-center min-w-0 flex-1">
                                <div className="w-10 h-10 p-2 rounded-full  flex items-center justify-center flex-shrink-0">
                                    <Icon name="profile" className="w-6 h-6 icon-neutral-default" />
                                </div>
                                <div ref={userNameRef} className="flex flex-col py-1 flex-1 min-w-0">
                                    <span className="w-fit text-style-label-title-regular text-color-text-neutral-default px-1 py-0.5 truncate">
                                        {userProfile.name}
                                    </span>
                                    <span className="text-style-label-secondary-regular text-color-text-neutral-tertiary px-1 py-0.5 truncate">
                                        {userProfile.tier}
                                    </span>
                                </div>
                            </div>
                            <Label
                                colorScheme="primary"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpgrade?.();
                                }}
                                className="cursor-pointer mr-2"
                            >
                                Upgrade
                            </Label>
                        </div>
                    </div>

                    {openMenuChatId && (
                        <div
                            ref={menuRef}
                            className="fixed z-50"
                            style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                            }}
                        >
                            <ChatHistoryMenu
                                items={[
                                    {
                                        id: 'rename',
                                        label: 'Rename',
                                        icon: <Icon name="edit-a" />,
                                        onClick: () => handleMenuAction('rename', openMenuChatId),
                                    },
                                    {
                                        id: 'share',
                                        label: 'Share',
                                        icon: <Icon name="export-a" />,
                                        onClick: () => handleMenuAction('share', openMenuChatId),
                                    },
                                    {
                                        id: 'move',
                                        label: 'Move to project',
                                        icon: <Icon name="document-copy" />,
                                        onClick: () => handleMenuAction('move', openMenuChatId),
                                        dividerAfter: true,
                                    },
                                    {
                                        id: 'delete',
                                        label: 'Delete',
                                        icon: <Icon name="trash" />,
                                        onClick: () => handleMenuAction('delete', openMenuChatId),
                                        variant: 'danger',
                                    },
                                ]}
                            />
                        </div>
                    )}

                    {isUserMenuOpen && (
                        <div
                            ref={userMenuRef}
                            className="fixed z-50"
                            style={{
                                bottom: `${userMenuPosition.top}px`,
                                left: `${userMenuPosition.left}px`,
                            }}
                        >
                            <UserMenu
                                zoomLevel="100%"
                                onZoom={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Zoom clicked');
                                }}
                                onAccount={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('My Account clicked');
                                }}
                                onProjects={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Projects clicked');
                                }}
                                onSubscriptions={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Subscriptions clicked');
                                }}
                                onSettings={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Settings clicked');
                                }}
                                onRefer={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Refer and Earn clicked');
                                }}
                                onHelp={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Help & Support clicked');
                                }}
                                onLogout={() => {
                                    setIsUserMenuOpen(false);
                                    console.log('Logout clicked');
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center h-full">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IconButton
                                    onClick={handleToggle}
                                    icon="sidebar-right"
                                    variant="neutral"
                                    size="medium"
                                    corner="sharp"
                                    className="mt-4 mb-2 mx-3 bg-color-neutral-default
                                    hover:bg-option-color-hover"
                                    iconClassName='h-fit text-icon_button-color-neutral-icon'
                                    aria-label="Toggle Sidebar"
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Expand Sidebar
                            </TooltipContent>
                        </Tooltip>

                        {/* Action Icons */}
                        <div className="px-2 py-1 flex flex-col">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className='p-1'>
                                        <IconButton
                                            onClick={onNewChat}
                                            icon="edit-b"
                                            variant="neutral"
                                            size="medium"
                                            className="rounded-lg border-none bg-color-neutral-default hover:bg-option-color-hover transition-colors"
                                            iconClassName='text-icon_button-color-neutral-icon'
                                            aria-label="New Chat"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    New Chat
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className='p-1'>
                                        <IconButton
                                            onClick={onNotes}
                                            icon="note-a"
                                            variant="neutral"
                                            size="medium"
                                            className="rounded-lg border-none bg-color-neutral-default hover:bg-option-color-hover transition-colors"
                                            iconClassName='text-icon_button-color-neutral-icon'
                                            aria-label="Notes"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Notes
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className='p-1'>
                                        <IconButton
                                            onClick={onProjects}
                                            icon="folder-a"
                                            variant="neutral"
                                            size="medium"
                                            className="rounded-lg border-none bg-color-neutral-default hover:bg-option-color-hover transition-colors"
                                            iconClassName='text-icon_button-color-neutral-icon'
                                            aria-label="Projects"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Projects
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex-1"></div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className=" bg-color-neutral-default hover:bg-option-color-hover transition-colors border-none"
                                    aria-label="Profile"
                                    variant="neutral"
                                    size="medium"
                                    prefixIcon="profile"
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Profile
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </>
            )}
            <Confirmation
                open={!!deleteConfirmationChatId}
                onOpenChange={(open) => !open && setDeleteConfirmationChatId(null)}
                mainText="Delete Project"
                subText="This action cannot be undone."
                onConfirmClick={handleConfirmDelete}
                onCancelClick={() => setDeleteConfirmationChatId(null)}
                confirmVariant="destructive"
            />
            <ShareSearchDialog
                open={!!shareChatId}
                onOpenChange={(open) => !open && setShareChatId(null)}
                shareLink={`https://judix.in/share/${shareChatId}`}
                onShare={(recipients, note) => {
                    console.log('Sharing', recipients, note);
                    setShareChatId(null);
                }}
                onCopyLink={() => console.log('Link copied')}
                onDownloadPdf={() => console.log('Downloading PDF')}
            />
        </div>
    );
};
