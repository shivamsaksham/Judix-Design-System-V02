'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { UserQuery } from './user-query';
import { Artifacts } from './artifacts';
import { ResponseActions } from './response-actions';
import { FollowUpQuery } from '@/components/block/follow-up-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AiThinking, type AiThinkingProps } from './ai-thinking';

export interface ContentProps {
    query: string;
    caseLawsCount: number;
    actsCount: number;
    markdown: string;
    onCaseLawsClick?: () => void;
    onActsClick?: () => void;
    onQueryEdit?: (newQuery: string) => void;
    onLike?: () => void;
    onDislike?: () => void;
    onRefresh?: () => void;
    onCopy?: () => void;
    isLiked?: boolean;
    isDisliked?: boolean;
    // Follow-up queries
    followUpQueries?: string[];
    onFollowUpQueryClick?: (query: string) => void;
    className?: string;
    hideQuery?: boolean;
    animate?: boolean;
    isStreaming?: boolean;
    aiThinkingProps?: AiThinkingProps;
}

export const Content = ({
    query,
    caseLawsCount,
    actsCount,
    markdown,
    onCaseLawsClick,
    onActsClick,
    onQueryEdit,
    onLike,
    onDislike,
    onRefresh,
    onCopy,
    isLiked,
    isDisliked,
    followUpQueries,
    onFollowUpQueryClick,
    className,
    hideQuery,
    animate = false,
    isStreaming = false,
    aiThinkingProps,
}: ContentProps) => {
    const [displayText, setDisplayText] = React.useState(animate ? "" : markdown);

    React.useEffect(() => {
        const processedMarkdown = markdown ? markdown.replace(/\[\[(?:source:)?query:[a-zA-Z0-9]+\]\]/gi, query || "") : "";
        if (!animate) {
            setDisplayText(processedMarkdown);
            return;
        }

        let index = 0;
        setDisplayText("");

        const intervalId = setInterval(() => {
            setDisplayText((prev) => {
                if (index >= processedMarkdown.length) {
                    clearInterval(intervalId);
                    return processedMarkdown;
                }
                const nextChar = processedMarkdown.charAt(index);
                index++;
                return prev + nextChar;
            });
        }, 5); // Fast typing speed

        return () => clearInterval(intervalId);
    }, [markdown, query, animate]);

    return (
        <div className={cn('flex flex-col w-full mx-auto gap-4', className)}>
            {/* User Query Section */}
            {!hideQuery && (
                <UserQuery
                    query={query}
                    onEdit={onQueryEdit}
                />
            )}

            {/* AI Thinking Component */}
            {aiThinkingProps && (
                <AiThinking {...aiThinkingProps} />
            )}

            {/* Complete Result Section */}
            {(caseLawsCount > 0 || actsCount > 0) && (
                <div className="flex flex-col">
                    <Artifacts
                        title='Cases'
                        subtitle={`Found ${caseLawsCount} cases`}
                        onClick={onCaseLawsClick}
                        isResult
                    />
                    <Artifacts
                        title='Acts and Sections'
                        subtitle={`${actsCount} Acts identified`}
                        onClick={onActsClick}
                    />
                </div>
            )}

            {displayText && <div className="text-style-textblock-secondary-bodytext-regular text-color-text-neutral-emphasis">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ children }) => <p className="mb-6">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-6 mb-6">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-6 mb-6 space-y-6">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        h1: ({ children }) => <h1 className="text-style-heading-h1 text-color-text-neutral-default mb-6">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-style-heading-h2 text-color-text-neutral-default mb-6">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-style-heading-h3 text-color-text-neutral-default mb-6">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-style-heading-h4 text-color-text-neutral-default mb-6">{children}</h4>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-color-border-neutral-default pl-4 mb-6 italic">{children}</blockquote>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        code: ({ children }) => <code className="bg-color-surface-neutral-subtle px-1 py-0.5 rounded">{children}</code>,
                        pre: ({ children }) => <pre className="bg-color-surface-neutral-subtle p-4 rounded-lg mb-6 overflow-x-auto">{children}</pre>,
                        hr: () => <hr className="border-color-border-neutral-default mb-6" />,
                        a: ({ href, children }) => <a href={href} className="text-color-text-primary-default hover:underline">{children}</a>,
                    }}
                >
                    {displayText}
                </ReactMarkdown>
            </div>}

            {displayText && (!isStreaming || (followUpQueries && followUpQueries.length > 0)) && <ResponseActions
                className='w-fit'
                onLike={onLike}
                onDislike={onDislike}
                onRefresh={onRefresh}
                onCopy={onCopy}
                isLiked={isLiked}
                isDisliked={isDisliked}
                contentToCopy={markdown}
            />}

            {/* Follow-up Queries */}
            {followUpQueries && followUpQueries.length > 0 && (
                <div>
                    <div className="flex flex-wrap">
                        {followUpQueries.map((query, index) => (
                            <FollowUpQuery
                                key={index}
                                query={query}
                                onClick={() => onFollowUpQueryClick?.(query)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
