"use client";
import React from "react";
import { Button, TextInput, IconButton } from "../ui";

interface LoginOTPProps {
    timerText?: string;
    buttonText?: string;
}

export function LoginOTP({ timerText, buttonText }: LoginOTPProps) {
    const [otp, setOtp] = React.useState<string[]>(new Array(6).fill(""));
    const [isLoading, setIsLoading] = React.useState(false);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Move focus to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pasteData.some((char) => isNaN(Number(char)))) return;

        const newOtp = [...otp];
        pasteData.forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
    };

    const isComplete = otp.every((digit) => digit !== "");

    const handleVerify = () => {
        if (!isComplete) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log("Verified OTP:", otp.join(""));
        }, 2000);
    };

    return (
        <div className="flex flex-col w-full gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4 ">
                <div className="flex flex-row w-fit gap-[5px] items-center justify-center">
                    <IconButton icon="arrow-left-a" variant={'neutral'} className="w-4 h-4 p-0"></IconButton>
                    <div className="flex gap-2 p-1 text-style-body-default-regular text-color-text-neutral-default">
                        Back
                    </div>
                </div>
                <div className="text-center p-1 justify-center items-center text-style-heading-primary-regular text-color-text-neutral-default">
                    OTP Verification
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="text-center items-center justify-center p-1 text-color-text-neutral-secondary text-style-textblock-primary-subtext-regular">
                        It may take a few seconds for the OTP to arrive. Check your WhatsApp for the message.
                    </div>

                    {/* OTP Input */}
                    <div className="flex justify-center p-1">
                        <div className="flex flex-col w-full max-w-[356px] gap-1 items-center">
                            <div className="flex gap-1 justify-center">
                                {otp.map((data, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        className="w-[51.33px] h-[51.33px] md:w-[56px] md:h-[56px] textinput-border-radius-default textinput-border-weight-default text-base md:text-lg text-center"
                                        style={{ textAlign: 'center' }}
                                        maxLength={1}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timer and Resend */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="p-1 text-color-text-neutral-secondary text-style-body-default-regular">{timerText}</span>
                        <span className="p-1 text-color-text-primary-default text-style-body-default-regular">
                            Resend OTP
                        </span>
                    </div>

                    {/* Action Button */}
                    <Button
                        className="w-full h-11"
                        disabled={!isComplete || isLoading}
                        onClick={handleVerify}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            buttonText
                        )}
                    </Button>

                    {/* Footer */}
                    <div className="p-1 text-center text-color-text-neutral-tertiary text-style-body-default-regular">
                        Change phone number
                    </div>
                </div>
            </div>
        </div>
    );
}
