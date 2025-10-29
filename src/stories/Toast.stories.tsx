import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useMemo } from 'react';
import { ToastContainer, showToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

type ToastKind = 'alert' | 'success' | 'notice' | 'info';

type ToastPreviewProps = {
  type: ToastKind;
  title?: string;
  message: string;
};

const ToastPreview = ({ type, title, message }: ToastPreviewProps) => {
  const triggerToast = useMemo(() => {
    return () => {
      showToast[type](message, title);
    };
  }, [type, message, title]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ToastContainer />
      <Button onClick={triggerToast}>Show {type} toast</Button>
    </div>
  );
};

const meta: Meta<typeof ToastPreview> = {
  title: 'UI/Toast',
  component: ToastPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['alert', 'success', 'notice', 'info'],
    },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  args: {
    type: 'info',
    title: 'Heads up',
    message: 'Profile updated successfully.',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
