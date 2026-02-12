'use client';
import React, { useState } from 'react';
import { UserQuery } from '@/components/block/user-query';

export default function UserQueryDemo() {
    const [queries, setQueries] = useState([
        {
            id: '1',
            text: 'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.',
        },
        {
            id: '2',
            text: 'What are the key provisions of Section 498A IPC?',
        },
        {
            id: '3',
            text: 'Explain the difference between cognizable and non-cognizable offences.',
        },
    ]);

    const handleEdit = (id: string, newQuery: string) => {
        setQueries((prev) =>
            prev.map((q) => (q.id === id ? { ...q, text: newQuery } : q))
        );
        console.log(`Query ${id} updated to:`, newQuery);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    User Query Component Demo
                </h1>
                <p className="text-gray-600 mb-8">
                    Interactive demonstration of the UserQuery component with edit and copy functionality.
                </p>

                <div className="space-y-0 bg-white rounded-lg shadow-sm overflow-hidden">
                    {queries.map((query) => (
                        <UserQuery
                            key={query.id}
                            query={query.text}
                            onEdit={(newQuery) => handleEdit(query.id, newQuery)}
                        />
                    ))}
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">
                        Features:
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Hover over any query to see edit and copy icons</li>
                        <li>Click the edit icon to modify the query</li>
                        <li>Click the copy icon to copy to clipboard (shows toast notification)</li>
                        <li>Changes are saved when you click &quot;Save&quot;</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
