import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { JudgementTile } from './judgement-tile';

export interface SearchResult {
    id: string;
    title: string;
    citation: string;
    score: number;
    snippet: string;
    citationCount: number;
    court: string;
}

export interface SearchbarResultsProps {
    className?: string;
    results?: SearchResult[];
}

const MOCK_RESULTS: SearchResult[] = [
    {
        id: '1',
        title: 'Deepak Singh Alias vs Mukesh Kumar & Ors',
        citation: '2024 3 SCR 231',
        score: 96.8,
        snippet: 'Appeal arising from SLP (Crl.) No. 354 of 2019 has been preferred against the judgment dated 12.12.2018 passed by the High Court of Gujarat in R/Criminal Misc. Application No. 7960 of 2011, dismissing the appellant\'s prayer for quashing of t...',
        citationCount: 12,
        court: 'Supreme Court of India'
    },
    {
        id: '2',
        title: 'Deepak Singh Alias vs Mukesh Kumar & Ors',
        citation: '2024 3 SCR 231',
        score: 96.8,
        snippet: 'Appeal arising from SLP (Crl.) No. 354 of 2019 has been preferred against the judgment dated 12.12.2018 passed by the High Court of Gujarat in R/Criminal Misc. Application No. 7960 of 2011, dismissing the appellant\'s prayer for quashing of t...',
        citationCount: 12,
        court: 'Supreme Court of India'
    }
];

export const SearchbarResults = ({ className, results = MOCK_RESULTS }: SearchbarResultsProps) => {
    const [activeTab, setActiveTab] = useState<'judgments' | 'acts'>('judgments');

    return (
        <div className={cn("w-full flex flex-col gap-4 bg-color-surface-neutral-default overflow-hidden", className)}>
            {/* Header: Tabs and Actions */}
            <div className="p-2 flex items-center justify-between border-b border-color-border-neutral-default">
                {/* Tabs */}
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('judgments')}
                        className={cn(
                            "w-40 p-3 text-style-body-default-regular border-b- transition-colors text-color-text-neutral-emphasis",
                            activeTab === 'judgments'
                                ? "border-color-border-primary-strong"
                                : "border-transparent  hover:text-color-text-neutral-default"
                        )}
                    >
                        Judgments
                    </button>
                    <button
                        onClick={() => setActiveTab('acts')}
                        className={cn(
                            "w-40 p-3 text-style-body-default-regular border-b-2 transition-colors text-color-text-neutral-emphasis",
                            activeTab === 'acts'
                                ? "border-color-border-primary-strong"
                                : "border-transparent  hover:text-color-text-neutral-default"                        )}
                    >
                        Acts
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 text-style-body-default-regular text-color-text-neutral-default">
                    <button className="p-1 flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Icon name="share-a" className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                    <button className="p-1 flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Icon name="export-d" className="w-5 h-5" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Results List */}
            <div className="flex flex-col">
                {results.map((result, index) => (
                    <React.Fragment key={`${result.id}-${index}`}>
                        {index > 0 && <hr className="border-t border-color-border-neutral-default my-2" />}
                        <JudgementTile
                            title={result.title}
                            matchPercentage={`${result.score.toFixed(1)}%`}
                            citationCount={result.citationCount}
                            description={result.snippet}
                            year={result.citation}
                            court={result.court}
                            className='rounded-none border-none'
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
