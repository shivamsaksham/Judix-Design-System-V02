import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const meta = {
    title: 'UI/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="tab1" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
                <p className="text-sm">Content for Tab 1</p>
            </TabsContent>
            <TabsContent value="tab2">
                <p className="text-sm">Content for Tab 2</p>
            </TabsContent>
            <TabsContent value="tab3">
                <p className="text-sm">Content for Tab 3</p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithCards: Story = {
    render: () => (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">Make changes to your account here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">Change your password here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};

export const ManyTabs: Story = {
    render: () => (
        <Tabs defaultValue="1" className="w-[600px]">
            <TabsList>
                <TabsTrigger value="1">Overview</TabsTrigger>
                <TabsTrigger value="2">Analytics</TabsTrigger>
                <TabsTrigger value="3">Reports</TabsTrigger>
                <TabsTrigger value="4">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <p className="text-sm">Overview content</p>
            </TabsContent>
            <TabsContent value="2">
                <p className="text-sm">Analytics content</p>
            </TabsContent>
            <TabsContent value="3">
                <p className="text-sm">Reports content</p>
            </TabsContent>
            <TabsContent value="4">
                <p className="text-sm">Settings content</p>
            </TabsContent>
        </Tabs>
    ),
};
