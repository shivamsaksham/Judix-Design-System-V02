"use client";
import React from "react";
import { TextInput, Button, Checkbox } from "../ui";
import { cn } from "../../lib/utils";

export interface LoginProps {
    countryCode?: string;
}

export function Login({ countryCode = "+91" }: LoginProps) {
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only digits
        if (/^\d*$/.test(value)) {
            // Limit to 10 digits
            if (value.length <= 10) {
                setPhoneNumber(value);
                if (error) setError("");
            }
        }
    };

    const handleContinue = () => {
        if (phoneNumber.length !== 10) {
            setError("Phone number must be exactly 10 digits");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log("Proceeding with phone:", phoneNumber);
        }, 2000);
    };

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
                                className={cn(
                                    "flex-1 h-[56px] py-[7px] textinput-border-radius-default textinput-border-weight-default textinput-font-placeholder-large",
                                    isLoading
                                )}
                                inputClassName="!textinput-font-placeholder-large"
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                errorMessage={error}
                                disabled={isLoading}
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
                        disabled={isLoading}
                        onClick={handleContinue}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            "Continue"
                        )}
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
