'use client';
import { HistorySidebar } from '@/components/block/history-sidebar';

export default function HistorySidebarDemo() {
    const sampleChatHistory = [
        { id: '1', title: 'Anticipatory bail in domestic violence cases', onClick: () => console.log('Chat 1') },
        { id: '2', title: 'Bail offence analysis', onClick: () => console.log('Chat 2') },
        { id: '3', title: 'BNSS section 12 summary', onClick: () => console.log('Chat 3') },
        { id: '4', title: 'Crime scene investigation rules', onClick: () => console.log('Chat 4') },
        { id: '5', title: 'Suicide in college hostel', onClick: () => console.log('Chat 5') },
        { id: '6', title: 'Property dispute resolution', onClick: () => console.log('Chat 6') },
        { id: '7', title: 'Contract law basics', onClick: () => console.log('Chat 7') },
        { id: '8', title: 'Trademark registration process', onClick: () => console.log('Chat 8') },
    ];

    const usageStats = {
        current: 31,
        total: 500,
        label: 'AI Searches',
    };

    const userProfile = {
        name: 'Aditya Anand',
        tier: 'Free tier',
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <HistorySidebar
                chatHistory={sampleChatHistory}
                usageStats={usageStats}
                userProfile={userProfile}
                onNewChat={() => console.log('New Chat clicked')}
                onNotes={() => console.log('Notes clicked')}
                onProjects={() => console.log('Projects clicked')}
                onResetChat={() => console.log('Reset Chat clicked')}
                onUpgrade={() => console.log('Upgrade clicked')}
                onRename={(id) => console.log('Rename chat:', id)}
                onShare={(id) => console.log('Share chat:', id)}
                onDelete={(id) => console.log('Delete chat:', id)}
                activeChatId="2"
            />

            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">HistorySidebar Demo</h1>
                    <p className="text-gray-600 mb-2">The sidebar on the left shows the complete HistorySidebar component.</p>
                    <p className="text-gray-600 mb-4">Try clicking the navigation icons, chat items, and the three-dot menu!</p>
                    <p className="text-sm text-gray-500">Check the browser console for click events.</p>
                </div>
            </div>
        </div>
    );
}
