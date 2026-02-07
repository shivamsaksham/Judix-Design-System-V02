"use client";
import React from "react";
import { Button, TextInput, IconButton } from "../ui";

interface LoginOTPProps {
    timerText?: string;
    buttonText?: string;
}

export function LoginOTP({ timerText, buttonText }: LoginOTPProps) {
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
                        <div className="flex flex-col w-full max-w-[356px] gap-1">
                            <div className="flex gap-1 justify-center">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <TextInput
                                        key={index}
                                        className="w-[51.33px] h-[51.33px] md:w-[56px] md:h-[56px] textinput-border-radius-default textinput-border-weight-default text-base md:text-lg"
                                        style={{ textAlign: 'center' }}
                                        maxLength={1}
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
                    <Button className="w-full h-11">
                        {buttonText}
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
