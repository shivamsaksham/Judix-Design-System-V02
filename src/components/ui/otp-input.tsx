"use client";

import React, { useRef } from "react";
import { TextInput } from "./text-input";

export interface OtpInputProps {
    value: string[];
    onChange: React.Dispatch<React.SetStateAction<string[]>>;
    disabled?: boolean;
    length?: number;
}

export function OtpInput({ value, onChange, disabled = false, length = 6 }: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        // Strip out any non-numbers (letters, spaces, invisible characters)
        const digits = element.value.replace(/\D/g, "");
        // If there are multiple characters, always just take the final typed one
        const val = digits.slice(-1);

        onChange(prev => {
            const newOtp = [...prev];
            newOtp[index] = val;
            return newOtp;
        });

        // Focus next input immediately if a number was logged
        if (val !== "" && index < length - 1) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 10);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            setTimeout(() => {
                inputRefs.current[index - 1]?.focus();
            }, 10);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        // Strictly filter the clipboard to only accept real digits
        const pasteText = e.clipboardData.getData("text").replace(/\D/g, "");
        const pasteData = pasteText.slice(0, length).split("");
        
        if (pasteData.length === 0) return;

        onChange(prev => {
            const newOtp = [...prev];
            pasteData.forEach((char, i) => {
                if (i < length) newOtp[i] = char;
            });
            return newOtp;
        });
        
        setTimeout(() => {
            inputRefs.current[Math.min(pasteData.length, length - 1)]?.focus();
        }, 10);
    };

    return (
        <div className="flex justify-center">
            <div className="flex gap-1 w-full max-w-[356px] justify-center">
                {value.map((data, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        className="w-[51.33px] md:w-[56px] shrink-0 h-[51.33px] md:h-[56px] textinput-border-radius-default textinput-border-weight-default text-base md:text-lg"
                        inputClassName="w-full min-w-0 text-center !p-0 [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                        style={{ textAlign: 'center' }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2} // Increased to 2 so you can always type cleanly over an existing digit
                        value={data?.trim() || ""}
                        id={`otp-${index}`}
                        name={`otp-${index}`}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    );
}
