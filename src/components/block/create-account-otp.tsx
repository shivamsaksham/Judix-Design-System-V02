"use client";
import React from "react";
import { Button, TextInput, IconButton } from "../ui";

interface CreateAccountOTPProps {
    timerText?: string;
    buttonText?: string;
}

export function CreateAccountOTP({ timerText = "4:59", buttonText }: CreateAccountOTPProps) {
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
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <TextInput
                                        key={index}
                                        className="w-10 h-10 md:w-[56px] md:h-[56px] textinput-border-radius-default textinput-border-weight-default text-base md:text-lg"
                                        style={{ textAlign: 'center' }}
                                        maxLength={1}
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
                        <Button className="w-full h-11">
                            {buttonText}
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
