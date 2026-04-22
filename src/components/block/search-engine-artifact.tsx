import React from 'react';
import { cn } from '@/lib/utils';

export interface SearchEngineArtifactProps {
    title: string;
    className?: string;
}

export const SearchEngineArtifact = ({ title, className }: SearchEngineArtifactProps) => {
    return (
        <div className={cn("inline-flex items-center", className)}>
            <span className="text-style-body-default-regular bg-color-surface-primary-subtle_bg text-color-text-primary-default px-2.5 py-0.5 rounded-[4px] text-[15px] font-medium leading-relaxed whitespace-nowrap">
                {title}
            </span>
        </div>
    );
};

export default SearchEngineArtifact;
