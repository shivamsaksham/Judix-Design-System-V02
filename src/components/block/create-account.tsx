"use client";
import React, { useState } from "react";
import { TextInput, Button, Checkbox, RadioButton } from "../ui";

export interface CreateAccountProps {
    countryCode?: string;
}

export function CreateAccount({ countryCode = "+91" }: CreateAccountProps) {
    const [role, setRole] = useState<'advocate' | 'student' | null>(null);

    return (
        <div className="flex flex-col w-[480px] max-w-full gap-8">
            {/* Header */}
            <div className="text-center p-1 flex gap-2 justify-center items-center text-style-heading-primary-regular text-color-text-neutral-default">
                Create an account
            </div>

            <div className="flex flex-col gap-6 w-full">
                {/* Name Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4">
                            <TextInput
                                label="First Name"
                                placeholder="First Name"
                                className="flex-1 min-w-0 h-[56px] py-[7px]"
                                inputClassName="w-full !textinput-font-placeholder-large"
                            />

                            <TextInput
                                label="Last name"
                                placeholder="Last name"
                                className="flex-1 min-w-0 h-[56px] py-[7px]"
                                inputClassName="w-full !textinput-font-placeholder-large"
                            />
                        </div>
                        <TextInput
                            label="Phone number"
                            className="w-full h-14 textinput-font-placeholder-large"
                            inputClassName="!textinput-font-placeholder-large"
                            placeholder="WhatsApp number"
                            leadingIcon={
                                <div className="flex items-center justify-center p-1">
                                    <span className="text-color-text-neutral-default">{countryCode}</span>
                                </div>
                            }
                        />
                        <TextInput
                            label="Email ID"
                            placeholder="Email ID"
                            className="w-full h-14 textinput-font-placeholder-large"
                            inputClassName="!textinput-font-placeholder-large"
                        />
                    </div>
                    {/* Role Selection */}
                    <div className="flex gap-4">
                        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                            Who are you?
                        </span>
                        <div className="flex gap-2" >
                            <div className="flex gap-1 items-center" onClick={() => setRole('advocate')}>
                                <RadioButton
                                    checked={role === 'advocate'}
                                    onChange={() => setRole('advocate')}
                                />
                                <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                                    Advocate
                                </span>
                            </div>
                            <div className="flex gap-1 items-center" onClick={() => setRole('student')}>
                                <RadioButton
                                    checked={role === 'student'}
                                    onChange={() => setRole('student')}
                                />
                                <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                                    Law student
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Terms Checkbox */}
                <div className="flex gap-2 items-center">
                    <Checkbox id="terms" />
                    <label
                        htmlFor="terms"
                        className="p-1 text-color-text-neutral-default text-style-textblock-primary-subtext-regular"
                    >
                        I agree to the <span className="text-color-text-primary-default">terms and conditions</span> and <span className="text-color-text-primary-default">privacy policy</span>
                    </label>
                </div>

                {/* Continue Button */}
                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full h-11 button-border-radius-default"
                        size="large"
                    >
                        Continue
                    </Button>

                    {/* Footer */}
                    <div className="flex justify-center items-center gap-1">
                        <div className="w-fit p-1 text-color-text-neutral-default text-style-body-default-regular">
                            Already have an account?
                        </div>
                        <div className="w-fit p-1 text-color-text-primary-default text-style-body-default-emphasis border-b border-color-border-primary-strong border-weight-default cursor-pointer">
                            SIGN IN
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
