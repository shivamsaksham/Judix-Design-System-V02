'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import ContextWindowDropdown, { ContextItem } from './context-window-dropdown';
import { ChatHistoryMenu } from './chat-history-menu';
import { Icon } from 'judix-icon';
import { Button } from '../ui';

export interface NavBarProps {
    variant?: 'default' | 'project';
    onIndependentClick?: () => void;
    onConnectorClick?: () => void;
    onContextClick?: () => void;
    onShareClick?: () => void;
    onMenuClick?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
    onBackToResearch?: () => void;
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
    isNewChat?: boolean;
}

export default function NavBar({
    variant = 'default',
    onIndependentClick,
    onConnectorClick,
    onContextClick,
    onShareClick,
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
}: NavBarProps) {
    const [showContextDropdown, setShowContextDropdown] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contextLabelRef = useRef<HTMLDivElement>(null);
    const chatMenuRef = useRef<HTMLDivElement>(null);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (target.closest('[role="dialog"]')) {
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
            style={{ paddingRight: isResultPanelOpen ? '450px' : '1.25rem' }}
        >
            {variant === 'project' ? (
                <>
                    <div className="flex items-center py-[2.16px] cursor-pointer">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={85}
                            height={26}
                            className="p-[3.6px]"
                        />
                    </div>

                    <div className="flex items-center gap-4">
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
                            <span className="text-style-body-default-regular text-color-text-neutral-default">
                                {userName}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-color-surface-neutral-subtle_bg flex items-center justify-center">
                                <Icon name="Profile" className="w-5 h-5 text-color-icon-neutral-default" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between w-full my-[6px]">
                        <div className="flex items-center py-[2.16px] cursor-pointer">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={85}
                                height={26}
                                className="p-[3.6px]"
                            />
                        </div>

                        <div className="flex items-center">


                            <div className="flex items-center  mr-[10px]">
                                <Image
                                    src="/add-connector.svg"
                                    alt="Add"
                                    className="text-color-icon-primary-default -mr-[3px] cursor-pointer hover:opacity-80"
                                    width={41}
                                    height={24}
                                    onClick={onConnectorClick}
                                />
                                <Label
                                    colorScheme="primary"
                                    size="medium"
                                    onClick={onIndependentClick}
                                    className="cursor-pointer hover:bg-color-surface-neutral-default relative z-10 bg-color-surface-neutral-default"
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
                                {showContextDropdown && (
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
                                )}
                            </div>


                            <div className="flex items-center gap-3 ">
                                <Button
                                    onClick={onShareClick}
                                    variant="neutral"
                                    size="small"
                                    prefixIcon="export-b"
                                    className='border-none p-0 bg-color-surface-neutral-default m-[1px] gap-1'
                                    iconClassName="w-5 h-5 relative text-color-icon-neutral-secondary"
                                >
                                    <span className="p-1 text-style-body-default-regular">Share</span>
                                </Button>

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
                                                            id: 'share',
                                                            label: 'Share',
                                                            icon: <Icon name="Export" />,
                                                            onClick: () => {
                                                                setShowChatMenu(false);
                                                                onShareClick?.();
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
                </>
            )}
        </nav>
    );
}
