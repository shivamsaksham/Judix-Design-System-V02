import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof InputOTP>;

const meta: Meta<Props> = {
  title: "UI/Input OTP",
  component: InputOTP,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<Props>;

const OTP = (length: number) => (
  <InputOTP maxLength={length}>
    <InputOTPGroup>
      {Array.from({ length }).map((_, i) => (
        <InputOTPSlot key={i} index={i} />
      ))}
    </InputOTPGroup>
  </InputOTP>
);

export const Default: Story = {
  render: () => OTP(6),
};

export const FourDigit: Story = {
  render: () => OTP(4),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Enter verification code
      </label>
      {OTP(6)}
      <p className="text-xs text-gray-500">
        Please enter the 6-digit code sent to your email
      </p>
    </div>
  ),
};
