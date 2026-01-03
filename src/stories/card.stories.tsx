import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card content goes here. This is the main content area of the card.</p>
            </CardContent>
        </Card>
    ),
};

export const WithFooter: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>This card has a footer section</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Main content area with some text and information.</p>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="neutral">Cancel</Button>
                <Button>Save</Button>
            </CardFooter>
        </Card>
    ),
};

export const WithAction: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Card with Action</CardTitle>
                <CardDescription>Action button in header</CardDescription>
                <CardAction>
                    <Button size="small" variant="neutral">Edit</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>This card has an action button in the header area.</p>
            </CardContent>
        </Card>
    ),
};

export const Complete: Story = {
    render: () => (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Complete Card Example</CardTitle>
                <CardDescription>All card sections demonstrated</CardDescription>
                <CardAction>
                    <Button size="small" variant="neutral" prefixIcon="More" />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm">This card demonstrates all available sections:</p>
                    <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Header with title and description</li>
                        <li>Action button in header</li>
                        <li>Content area</li>
                        <li>Footer with actions</li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="neutral" size="small">Cancel</Button>
                <Button size="small">Confirm</Button>
            </CardFooter>
        </Card>
    ),
};

export const Multiple: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Card 1</CardTitle>
                    <CardDescription>First card</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">Content for the first card.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Card 2</CardTitle>
                    <CardDescription>Second card</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">Content for the second card.</p>
                </CardContent>
            </Card>
        </div>
    ),
};
