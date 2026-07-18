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
    onSourceClick?: (type: 'query' | 'judgement' | 'act', id?: string) => void;
    citations?: Array<{ id: string; source: string }>;
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
    citations = [],
    onDownloadLogs,
}: ContentProps) => {
    const [displayText, setDisplayText] = React.useState(animate ? "" : markdown);

    React.useEffect(() => {
        let md = markdown ? markdown : "";

        // Strip the LLM-generated "## Sources Used" section at the end
        md = md.replace(/\n*#{1,3}\s*Sources Used[\s\S]*$/i, "").trim();

        console.log("=== DEBUG Content Citations ===");
        console.log("Original markdown:", markdown);
        console.log("Processed md before citations:", md);
        console.log("Citations array:", citations);

        // Sources that should render as clickable citations. Anything else (topicSummary,
        // contextHint, etc) is internal AI noise and gets silently stripped below.
        const VALID_SOURCES = new Set(['case', 'judgment', 'judgement', 'act', 'query']);
        const sourceToType = (source: string): 'query' | 'judgement' | 'act' =>
            source === 'act' ? 'act' : source === 'query' ? 'query' : 'judgement';

        // Replace [N] or [prefix:db_id] citation markers with Markdown links: [N](#cite-type-id).
        // Adjacent marker runs like [1][2] are grouped into a single [1, 2](#cite-group-...) link
        // so they render as one Wikipedia-style badge instead of two separate footnotes.
        if (citations.length > 0 || md.match(/\[([^\]]+)\]/)) {
            const seen = new Map<string, { citation: typeof citations[0], num: number }>();
            let nextNumber = 1;
            let citationIndex = 0;

            const resolveMarker = (rawIdStr: string): { num: number; citation: typeof citations[0] } | null => {
                // Clean up any stray angle brackets or spaces the AI might have added
                const idStr = rawIdStr.replace(/[<>]/g, '').trim().split(' ')[0]; // take the first ID if there are multiple
                const isDigit = /^\d+$/.test(idStr);

                let citation = citations.find(c => c.id === idStr);

                // Fallback for older chats where it was just sequential digits
                if (!citation && isDigit && citations.length > 0) {
                    citation = seen.has(idStr) ? seen.get(idStr)?.citation : citations[citationIndex++];
                }

                if (!citation) {
                    // If it's a known system prefix like topicSummary, contextHint, metadata, etc, just remove it from text
                    if (idStr.includes('topicSummary') || idStr.includes('contextHint') || idStr.includes('metadata') || idStr.includes('chunk')) {
                        return null;
                    }
                    // For unmatched DB IDs, if we have citations, let's aggressively try to match it
                    // just in case it's a chunk ID and not a document ID
                    if (!isDigit && citations.length > 0) {
                        // We failed to find the exact ID, just consume the next available citation
                        // ONLY if it's a valid type
                        const nextValidCitation = citations.slice(citationIndex).find(c => VALID_SOURCES.has(c.source));
                        if (nextValidCitation) {
                            citation = nextValidCitation;
                            citationIndex = citations.indexOf(nextValidCitation) + 1;
                        } else {
                            return null; // No valid citations left
                        }
                    } else {
                        return null; // Unmatched and no citations left, hide the ugly marker
                    }
                }

                if (!VALID_SOURCES.has(citation.source)) {
                    return null; // Hide internal system citations silently
                }

                let displayNum;
                if (seen.has(idStr)) {
                    displayNum = seen.get(idStr)!.num;
                } else {
                    displayNum = nextNumber++;
                    seen.set(idStr, { citation, num: displayNum });
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
                    return `[${num}](#cite-${sourceToType(citation.source)}-${citation.id})`;
                }

                const nums = resolved.map(r => r.num).join(', ');
                const pairs = resolved.map(r => `${sourceToType(r.citation.source)}-${r.citation.id}`).join(',');
                return `[${nums}](#cite-group-${pairs})`;
            });
        }

        md = md.replace(/(\*{1,2})([^*]+)\1(\s*\[[^\]]+\]\((#cite-[^)]+)\))/g, (_match, _delimiter, boldText, citationLinkPart, citeHref) => {
            const titleHref = citeHref.replace('#cite-', '#cite-title-');
            return `[${boldText}](${titleHref})${citationLinkPart}`;
        });

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
                                        className="font-semibold text-color-text-primary-default hover:underline cursor-pointer text-left"
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
                                        className="font-semibold text-color-text-primary-default hover:underline cursor-pointer text-left"
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
                                        [{pairs.map((p, i) => (
                                            <React.Fragment key={`${p.type}-${p.id}`}>
                                                {i > 0 && ', '}
                                                <button
                                                    onClick={(e) => { e.preventDefault(); onSourceClick?.(p.type, p.id); }}
                                                    className="text-color-text-primary-default hover:underline font-medium text-xs cursor-pointer"
                                                >
                                                    {nums[i]}
                                                </button>
                                            </React.Fragment>
                                        ))}]
                                    </sup>
                                );
                            }
                            if (href?.startsWith('#cite-')) {
                                const parts = href.replace('#cite-', '').split('-');
                                const type = parts[0] as 'query' | 'judgement' | 'act';
                                const id = parts.slice(1).join('-');
                                return (
                                    <sup className="mx-[2px]">
                                        <button
                                            onClick={(e) => { e.preventDefault(); onSourceClick?.(type, id); }}
                                            className="text-color-text-primary-default hover:underline font-medium text-xs cursor-pointer"
                                        >
                                            [{children}]
                                        </button>
                                    </sup>
                                );
                            }
                            return <a href={href} className="text-color-text-primary-default hover:underline cursor-pointer">{children}</a>;
                        },
                    }}
                >
                    {displayText}
                </ReactMarkdown>
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
