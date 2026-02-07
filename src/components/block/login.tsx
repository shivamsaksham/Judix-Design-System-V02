"use client";
import React from "react";
import { TextInput, Button, Checkbox } from "../ui";
import { cn } from "../../lib/utils";

export interface LoginProps {
    countryCode?: string;
}

export function Login({ countryCode = "+91" }: LoginProps) {
    return (
        <div className="flex flex-col w-[480px] max-w-full mx-auto gap-8">
            {/* Header */}
            <div className="text-center p-1 flex gap-2 justify-center items-center text-style-heading-primary-regular text-color-text-neutral-default">
                Login to your account
            </div>


            {/* Phone Input Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1 w-full">
                            <div className="w-16 shrink-0">
                                <TextInput
                                    className="w-full h-[56px] textinput-border-radius-default textinput-border-weight-default justify-center items-center"
                                    style={{ display: 'none' }}
                                    leadingIcon={
                                        <div className="flex items-center justify-center w-full h-full">
                                            <span className="text-color-text-neutral-default textinput-font-placeholder-large leading-none">{countryCode}</span>
                                        </div>
                                    }
                                />
                            </div>
                            <TextInput
                                placeholder="Enter Phone Number"
                                className="flex-1 h-[56px] py-[7px] textinput-border-radius-default textinput-border-weight-default textinput-font-placeholder-large"
                                inputClassName="!textinput-font-placeholder-large"
                                type="tel"
                            />
                        </div>
                        <div className="p-1 text-style-label-default-regular text-color-text-neutral-secondary w-fit">
                            OTP will be sent to this number via{" "}
                            <span className="text-color-text-primary-default">WhatsApp</span>
                        </div>
                    </div>
                    {/* Remember Me */}
                    <div className="flex w-fit gap-2 justify-center items-center">
                        <Checkbox id="remember-me" />
                        <label
                            htmlFor="remember-me"
                            className="p-1 text-color-text-neutral-default text-style-body-default-regular"
                        >
                            Remember me
                        </label>
                    </div>
                </div>


                {/* Continue Button */}
                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full h-[44px] button-border-radius-default"
                        size="large"
                    >
                        Continue
                    </Button>

                    {/* Footer */}
                    <div className="p-1 flex items-start">
                        <div className="w-fit p-1 text-color-text-neutral-default text-style-body-default-regular">
                            New here?
                        </div>
                        <div>
                            <div className="w-fit p-1 text-color-text-primary-default text-style-body-default-emphasis border-b border-color-border-primary-strong border-weight-default">
                                JOIN FREE TIER
                            </div>
                            <div className="w-fit p-1 text-color-text-neutral-tertiary text-style-label-default-regular">
                                No card needed; upgrade anytime
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
