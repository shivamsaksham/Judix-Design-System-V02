'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { UserQuery } from './user-query';
import { Artifacts } from './artifacts';
import { Label } from '@/components/ui/label';
import { ResponseActions } from './response-actions';

export interface ContentProps {
    query: string;
    caseLawsCount: number;
    actsCount: number;
    content: React.ReactNode;
    onCaseLawsClick?: () => void;
    onActsClick?: () => void;
    onQueryEdit?: (newQuery: string) => void;
    className?: string;
}

export const Content = ({
    query,
    caseLawsCount,
    actsCount,
    content,
    onCaseLawsClick,
    onActsClick,
    onQueryEdit,
    className,
}: ContentProps) => {
    return (
        <div className={cn('flex flex-col max-w-4xl mx-auto', className)}>
            {/* User Query Section */}
            <UserQuery
                query={query}
                onEdit={onQueryEdit}
                className='mb-6'
            />

            {/* Results Section */}
            <div>
                <div className="mb-6">
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
            </div>

            {/* Content Section */}
            <div className="text-style-body-default-regular text-color-text-neutral-default mb-6">
                {content}
            </div>
            
            {/* Response Actions */}
            <ResponseActions className='w-fit'/>
        </div>
    );
};
