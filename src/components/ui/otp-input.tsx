"use client";

import React, { useRef } from "react";
import { TextInput } from "./text-input";

export interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    length?: number;
}

export function OtpInput({ value, onChange, disabled = false, length = 6 }: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        const digits = element.value.replace(/\D/g, "");
        const val = digits.slice(-1);

        const newOtpArray = value.split("").map((char, i) => (i === index ? val : char));
        // Fill up to length if needed
        while (newOtpArray.length < length) newOtpArray.push("");
        onChange(newOtpArray.join("").slice(0, length));

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
        const pasteText = e.clipboardData.getData("text").replace(/\D/g, "");
        const pasteData = pasteText.slice(0, length);
        
        if (pasteData.length === 0) return;

        onChange(pasteData);
        
        setTimeout(() => {
            inputRefs.current[Math.min(pasteData.length, length - 1)]?.focus();
        }, 10);
    };

    const displayArray = value.padEnd(length, " ").split("").slice(0, length);

    return (
        <div className="flex justify-center">
            <div className="flex gap-1 w-full max-w-[356px] justify-center">
                {displayArray.map((data, index) => (
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
