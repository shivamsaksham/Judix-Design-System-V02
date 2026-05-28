"use client";
import React from "react";
import { Button, TextInput, IconButton } from "../ui";

interface CreateAccountOTPProps {
    timerText?: string;
    buttonText?: string;
}

export function CreateAccountOTP({ timerText = "4:59", buttonText }: CreateAccountOTPProps) {
    const [phoneOtp, setPhoneOtp] = React.useState<string[]>(new Array(6).fill(""));
    const [emailOtp, setEmailOtp] = React.useState<string[]>(new Array(6).fill(""));
    const [isLoading, setIsLoading] = React.useState(false);

    const phoneInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const emailInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (
        element: HTMLInputElement,
        index: number,
        type: 'phone' | 'email',
        setOtp: React.Dispatch<React.SetStateAction<string[]>>,
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        if (isNaN(Number(element.value))) return false;

        setOtp(prev => {
            const newOtp = [...prev];
            newOtp[index] = element.value;
            return newOtp;
        });

        // Focus next input
        if (element.value && index < 5) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        otp: string[],
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>,
        type: 'phone' | 'email',
        setOtp: React.Dispatch<React.SetStateAction<string[]>>,
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pasteData.some((char) => isNaN(Number(char)))) return;

        setOtp(prev => {
            const newOtp = [...prev];
            pasteData.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            return newOtp;
        });
        refs.current[Math.min(pasteData.length, 5)]?.focus();
    };

    const isComplete = phoneOtp.every(d => d !== "") && emailOtp.every(d => d !== "");

    const handleVerify = () => {
        if (!isComplete) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log("Verified Phone:", phoneOtp.join(""), "Email:", emailOtp.join(""));
        }, 2000);
    };

    return (
        <div className="flex flex-col w-full gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
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
                    <div className="items-center text-center p-1 text-color-text-neutral-secondary text-style-textblock-primary-subtext-regular">
                        It may take a few seconds for the OTP to arrive. Check your WhatsApp and Email for the message.
                    </div>

                    {/* Phone OTP Input */}
                    <div className="flex flex-col gap-1 p-1">
                        <div className="flex items-center justify-center gap-1">
                            <IconButton icon="call" variant={'neutral'} className="w-5 h-5 p-0"></IconButton>
                            <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">Phone OTP</span>
                        </div>
                        <div className="flex justify-center">
                            <div className="flex gap-1 w-full max-w-[356px] justify-center">
                                {phoneOtp.map((data, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            phoneInputRefs.current[index] = el;
                                        }}
                                        className="w-[51.33px] h-[51.33px] md:w-[56px] md:h-[56px] textinput-border-radius-default textinput-border-weight-default text-base md:text-lg text-center"
                                        style={{ textAlign: 'center' }}
                                        maxLength={1}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index, 'phone', setPhoneOtp, phoneInputRefs)}
                                        onKeyDown={(e) => handleKeyDown(e, index, phoneOtp, phoneInputRefs)}
                                        onPaste={(e) => handlePaste(e, 'phone', setPhoneOtp, phoneInputRefs)}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <span className="p-1 text-color-text-primary-default text-style-body-default-regular">
                                Resend OTP
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 p-1">
                        <div className="flex items-center justify-center gap-1">
                            <IconButton icon="message-a" variant={'neutral'} className="w-5 h-5 p-0"></IconButton>
                            <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">Email OTP</span>
                        </div>
                        <div className="flex justify-center">
                            <div className="flex gap-1 w-full max-w-[356px] justify-center">
                                {emailOtp.map((data, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => {
                                            emailInputRefs.current[index] = el;
                                        }}
                                        className="w-[51.33px] h-[51.33px] md:w-[56px] md:h-[56px] textinput-border-radius-default textinput-border-weight-default text-base md:text-lg text-center"
                                        style={{ textAlign: 'center' }}
                                        maxLength={1}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index, 'email', setEmailOtp, emailInputRefs)}
                                        onKeyDown={(e) => handleKeyDown(e, index, emailOtp, emailInputRefs)}
                                        onPaste={(e) => handlePaste(e, 'email', setEmailOtp, emailInputRefs)}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <span className="p-1 text-color-text-primary-default text-style-body-default-regular">
                                Resend OTP
                            </span>
                        </div>
                    </div>

                </div>

                {/* Timer and Verify Button */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-start items-center">
                        <span className="p-1 text-color-text-neutral-secondary text-style-body-default-regular">{timerText}</span>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-3">
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
                        <div className="flex justify-end">
                            <div className="p-1 text-color-text-primary-default text-style-body-default-emphasis border-b border-color-border-primary-strong border-weight-default">
                                Change details
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
