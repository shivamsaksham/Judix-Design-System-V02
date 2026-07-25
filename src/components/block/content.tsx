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
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { SourceLookupCard } from '@/components/block/source-lookup-card';
import { useMediaQuery } from '@/hooks/use-mobile-query';

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
    onShare?: () => void;
    // Follow-up queries
    followUpQueries?: string[];
    onFollowUpQueryClick?: (query: string) => void;
    className?: string;
    hideQuery?: boolean;
    animate?: boolean;
    isStreaming?: boolean;
    aiThinkingProps?: AiThinkingProps;
    hideActions?: boolean;
    onExport?: (format: string) => void;
    onSourceClick?: (type: 'query' | 'judgement' | 'act', id?: string, openDetails?: boolean) => void;
    onWhyThisClick?: (title: string) => void;
    citations?: Array<{ 
        id: string; 
        source: string; 
        title?: string; 
        description?: string; 
        relevanceScore?: number; 
        pgData?: {
            overallSummary?: string;
            facts?: string;
            issue?: string;
            reasoning?: string;
        }
    }>;
    onDownloadLogs?: () => Promise<void> | void;
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
    onShare,
    onExport,
    isLiked,
    isDisliked,
    followUpQueries,
    onFollowUpQueryClick,
    className,
    hideQuery,
    animate = false,
    isStreaming = false,
    aiThinkingProps,
    hideActions = false,
    onSourceClick,
    onWhyThisClick,
    citations = [],
    onDownloadLogs,
}: ContentProps) => {
    const [displayText, setDisplayText] = React.useState(animate ? "" : markdown);
    const isTouchDevice = useMediaQuery("(max-width: 768px)");

    const renderCitationBadge = (
        label: React.ReactNode,
        className: string,
        onClick: (e: React.MouseEvent) => void,
        citation: typeof citations[0] | undefined,
        onViewSourceClick: () => void
    ) => {
        const button = (
            <button onClick={onClick} className={className}>
                {label}
            </button>
        );

        if (isTouchDevice) return button;

        const contentText = citation?.pgData?.issue || citation?.pgData?.overallSummary || citation?.pgData?.facts || citation?.pgData?.reasoning || citation?.description || 'No description available.';
        return (
            <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="top" align="center" className="p-0 border-0 shadow-none bg-transparent" sideOffset={8}>
                    <SourceLookupCard
                        title={citation?.title || 'Source Details'}
                        content={contentText}
                        onViewSourceClick={onViewSourceClick}
                        onWhyThisClick={() => onWhyThisClick?.(citation?.title || 'this case')}
                    />
                </TooltipContent>
            </Tooltip>
        );
    };

    React.useEffect(() => {
        let md = markdown ? markdown : "";

        // Strip the LLM-generated "## Sources Used" section at the end
        md = md.replace(/\n*#{1,3}\s*Sources Used[\s\S]*$/i, "").trim();

        const isActSource = (source: string) => source === 'act' || source === 'acts';
        const VALID_SOURCES = new Set(['case', 'judgment', 'judgement', 'act', 'acts', 'query']);
        const sourceToType = (source: string): 'query' | 'judgement' | 'act' =>
            isActSource(source) ? 'act' : source === 'query' ? 'query' : 'judgement';
        const formatLabel = (source: string, num: number): string =>
            isActSource(source) ? `act-${num}` : `${num}`;

        if (citations.length > 0 || md.match(/\[([^\]]+)\]/)) {
            const seenMarker = new Map<string, { citation: typeof citations[0], num: number }>();
            const citationToNum = new Map<string, number>();
            let nextCaseNumber = 1;
            let nextActNumber = 1;
            let citationIndex = 0;

            const resolveMarker = (rawIdStr: string): { num: number; citation: typeof citations[0] } | null => {
                // Clean up any stray angle brackets or spaces the AI might have added
                const fullMarker = rawIdStr.replace(/[<>]/g, '').trim();
                const firstWord = fullMarker.split(' ')[0];
                const isDigit = /^\d+$/.test(fullMarker) || /^\d+$/.test(firstWord);

                let citation = citations.find(c => c.id === fullMarker);
                if (!citation) {
                    citation = citations.find(c => c.id === firstWord);
                }

                // Fallback for older chats where it was just sequential digits
                if (!citation && isDigit && citations.length > 0) {
                    citation = seenMarker.has(fullMarker) ? seenMarker.get(fullMarker)?.citation : citations[citationIndex++];
                }

                if (!citation) {
                    return null;
                }

                if (!VALID_SOURCES.has(citation.source)) {
                    return null;
                }

                let displayNum;
                if (seenMarker.has(fullMarker)) {
                    displayNum = seenMarker.get(fullMarker)!.num;
                } else if (citationToNum.has(citation.id)) {
                    displayNum = citationToNum.get(citation.id)!;
                    seenMarker.set(fullMarker, { citation, num: displayNum });
                } else {
                    displayNum = isActSource(citation.source) ? nextActNumber++ : nextCaseNumber++;
                    citationToNum.set(citation.id, displayNum);
                    seenMarker.set(fullMarker, { citation, num: displayNum });
                }

                return { num: displayNum, citation };
            };

            // Matches one marker, or a run of markers separated only by whitespace, e.g. "[1][2]" or "[1] [2]"
            md = md.replace(/\[[^\]]+\](?:\s*\[[^\]]+\])*/g, (run) => {
                const rawIds = run.match(/\[([^\]]+)\]/g) || [];
                const resolved = rawIds
                    .map(marker => resolveMarker(marker.slice(1, -1)))
                    .filter((r): r is { num: number; citation: typeof citations[0] } => r !== null);

                if (resolved.length === 0) return '';

                if (resolved.length === 1) {
                    const { num, citation } = resolved[0];
                    return `[${formatLabel(citation.source, num)}](#cite-${sourceToType(citation.source)}-${citation.id})`;
                }

                const nums = resolved.map(r => formatLabel(r.citation.source, r.num)).join(', ');
                const pairs = resolved.map(r => `${sourceToType(r.citation.source)}-${r.citation.id}`).join(',');
                return `[${nums}](#cite-group-${pairs})`;
            });
        }

        md = md.replace(/(\*{1,2})([^*\[\]\n]+)\1(\s*\[[^\]]+\]\((#cite-[^)]+)\))/g, (_match, _delimiter, boldText, citationLinkPart, citeHref) => {
            const titleHref = citeHref.replace('#cite-', '#cite-title-');
            return `[${boldText}](${titleHref})${citationLinkPart}`;
        });

        md = md.replace(/\*{1,2}(\s*\[[^\]]+\]\(#cite-[^)]+\))/g, '$1');
        md = md.replace(/(\[[^\]]+\]\(#cite-[^)]+\))\s*\*{1,2}/g, '$1');

        if (!animate) {
            setDisplayText(md);
            return;
        }

        let index = 0;
        setDisplayText("");

        const intervalId = setInterval(() => {
            setDisplayText((prev) => {
                if (index >= md.length) {
                    clearInterval(intervalId);
                    return md;
                }
                const nextChar = md.charAt(index);
                index++;
                return prev + nextChar;
            });
        }, 5); // Fast typing speed

        return () => clearInterval(intervalId);
    }, [markdown, query, animate, citations]);

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
                <div className="flex flex-col gap-1">
                    <div>
                        <Label colorScheme="neutral" size="medium" className='bg-label-color-neutral-hover'>
                            Results
                        </Label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                        <Artifacts
                            title='Cases'
                            subtitle={`Found ${caseLawsCount} cases`}
                            onClick={onCaseLawsClick}
                        />
                        <Artifacts
                            title='Acts and Sections'
                            subtitle={`${actsCount} Acts identified`}
                            onClick={onActsClick}
                        />
                    </div>
                </div>
            )}

            {displayText && <div className="text-style-textblock-secondary-bodytext-regular text-color-text-neutral-emphasis">
                <TooltipProvider delayDuration={200}>
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
                        a: ({ href, children }) => {
                            if (href?.startsWith('#cite-title-group-')) {
                                const pairs = href.replace('#cite-title-group-', '').split(',').map(p => {
                                    const sep = p.indexOf('-');
                                    return { type: p.slice(0, sep) as 'query' | 'judgement' | 'act', id: p.slice(sep + 1) };
                                });
                                return (
                                    <button
                                        onClick={(e) => { e.preventDefault(); onSourceClick?.(pairs[0].type, pairs[0].id); }}
                                        className="font-semibold hover:underline cursor-pointer text-left text-color-text-primary-default"
                                    >
                                        {children}
                                    </button>
                                );
                            }
                            if (href?.startsWith('#cite-title-')) {
                                const parts = href.replace('#cite-title-', '').split('-');
                                const type = parts[0] as 'query' | 'judgement' | 'act';
                                const id = parts.slice(1).join('-');
                                return (
                                    <button
                                        onClick={(e) => { e.preventDefault(); onSourceClick?.(type, id); }}
                                        className="font-semibold hover:underline cursor-pointer text-left text-color-text-primary-default"
                                    >
                                        {children}
                                    </button>
                                );
                            }
                            if (href?.startsWith('#cite-group-')) {
                                const pairs = href.replace('#cite-group-', '').split(',').map(p => {
                                    const sep = p.indexOf('-');
                                    return { type: p.slice(0, sep) as 'query' | 'judgement' | 'act', id: p.slice(sep + 1) };
                                });
                                const nums = String(children).split(',').map(n => n.trim());
                                return (
                                    <sup className="mx-[2px]">
                                        [{pairs.map((p, i) => {
                                            const citation = citations?.find(c => c.id === p.id);
                                            return (
                                                <React.Fragment key={`${p.type}-${p.id}`}>
                                                    {i > 0 && ', '}
                                                    {renderCitationBadge(
                                                        nums[i],
                                                        "text-color-text-primary-default hover:underline font-medium text-xs cursor-pointer",
                                                        (e) => { e.preventDefault(); onSourceClick?.(p.type, p.id); },
                                                        citation,
                                                        () => onSourceClick?.(p.type, p.id, true)
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}]
                                    </sup>
                                );
                            }
                            if (href?.startsWith('#cite-')) {
                                const parts = href.replace('#cite-', '').split('-');
                                const type = parts[0] as 'query' | 'judgement' | 'act';
                                const id = parts.slice(1).join('-');
                                const citation = citations?.find(c => c.id === id);
                                return (
                                    <sup className="mx-[2px]">
                                        {renderCitationBadge(
                                            <>[{children}]</>,
                                            "text-color-text-primary-default hover:underline font-medium text-xs cursor-pointer",
                                            (e) => { e.preventDefault(); onSourceClick?.(type, id); },
                                            citation,
                                            () => onSourceClick?.(type, id, true)
                                        )}
                                    </sup>
                                );
                            }
                            return <a href={href} className="text-color-text-primary-default hover:underline cursor-pointer">{children}</a>;
                        },
                    }}
                >
                    {displayText}
                </ReactMarkdown>
                </TooltipProvider>
            </div>}

            {displayText && (!isStreaming || (followUpQueries && followUpQueries.length > 0)) && !hideActions && <ResponseActions
                className='w-fit'
                onLike={onLike}
                onDislike={onDislike}
                onRefresh={onRefresh}
                onCopy={onCopy}
                onShare={onShare}
                onExport={onExport}
                onDownloadLogs={onDownloadLogs}
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
