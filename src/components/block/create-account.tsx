"use client";
import React, { useState } from "react";
import { TextInput, Button, Checkbox, RadioButton } from "../ui";
import { cn } from "../../lib/utils";

export interface CreateAccountProps {
    countryCode?: string;
}

export function CreateAccount({ countryCode = "+91" }: CreateAccountProps) {
    const [role, setRole] = useState<'advocate' | 'student' | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        terms: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Initial Validation functions
    const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (field: string, value: any) => {
        let newErrors = { ...errors };

        if (field === "firstName" || field === "lastName") {
            // Allow only alphabets and spaces
            if (value && !validateName(value)) return;
            if (newErrors[field]) delete newErrors[field];
        }

        if (field === "phone") {
            // Allow only digits, max 10
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
            if (newErrors.phone) delete newErrors.phone;
        }

        if (field === "email") {
            if (newErrors.email) delete newErrors.email;
        }

        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoleChange = (selectedRole: 'advocate' | 'student') => {
        setRole(selectedRole);
        if (errors.role) {
            const newErrors = { ...errors };
            delete newErrors.role;
            setErrors(newErrors);
        }
    };

    const handleTermsChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, terms: checked }));
        if (errors.terms && checked) {
            const newErrors = { ...errors };
            delete newErrors.terms;
            setErrors(newErrors);
        }
    };

    const handleBlur = (field: string) => {
        const value = formData[field as keyof typeof formData];
        let error = "";

        if (field === "firstName") {
            if (!value || (typeof value === 'string' && !value.trim())) error = "First name is required";
            else if (typeof value === 'string' && value.length < 2) error = "Min length is 2 characters";
        }

        if (field === "lastName") {
            if (!value || (typeof value === 'string' && !value.trim())) error = "Last name is required";
            else if (typeof value === 'string' && value.length < 2) error = "Min length is 2 characters";
        }

        if (field === "phone") {
            if (!value) error = "Phone number is required";
            else if (typeof value === 'string' && value.length !== 10) error = "Phone number must be exactly 10 digits";
        }

        if (field === "email") {
            if (!value) error = "Email is required";
            else if (typeof value === 'string' && !validateEmail(value)) error = "Invalid email format";
        }

        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
            isValid = false;
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = "Min length is 2 characters";
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
            isValid = false;
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = "Min length is 2 characters";
            isValid = false;
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (formData.phone.length !== 10) {
            newErrors.phone = "Phone number must be exactly 10 digits";
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        if (!role) {
            // Required but no error message shown
            isValid = false;
        }

        if (!formData.terms) {
            // Required but no error message shown
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log("Form Submitted", { ...formData, role });
        }, 2000);
    };

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
                                className={cn("flex-1 min-w-0 h-[56px] py-[7px]", isLoading && "opacity-100")}
                                inputClassName="w-full !textinput-font-placeholder-large"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                onBlur={() => handleBlur("firstName")}
                                errorMessage={errors.firstName}
                                disabled={isLoading}
                            />

                            <TextInput
                                label="Last name"
                                placeholder="Last name"
                                className={cn("flex-1 min-w-0 h-[56px] py-[7px]", isLoading && "opacity-100")}
                                inputClassName="w-full !textinput-font-placeholder-large"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                onBlur={() => handleBlur("lastName")}
                                errorMessage={errors.lastName}
                                disabled={isLoading}
                            />
                        </div>
                        <TextInput
                            label="Phone number"
                            className={cn("w-full h-14 textinput-font-placeholder-large", isLoading && "opacity-100")}
                            inputClassName="!textinput-font-placeholder-large"
                            placeholder="WhatsApp number"
                            leadingIcon={
                                <div className="flex items-center justify-center p-1">
                                    <span className="text-color-text-neutral-default">{countryCode}</span>
                                </div>
                            }
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            onBlur={() => handleBlur("phone")}
                            errorMessage={errors.phone}
                            disabled={isLoading}
                        />
                        <TextInput
                            label="Email ID"
                            placeholder="Email ID"
                            className={cn("w-full h-14 textinput-font-placeholder-large", isLoading && "opacity-100")}
                            inputClassName="!textinput-font-placeholder-large"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onBlur={() => handleBlur("email")}
                            errorMessage={errors.email}
                            disabled={isLoading}
                        />
                    </div>
                    {/* Role Selection */}
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-4">
                            <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                                Who are you?
                            </span>
                            <div className="flex gap-2" >
                                <div className={cn("flex gap-1 items-center", isLoading && "opacity-50 pointer-events-none")} onClick={() => !isLoading && handleRoleChange('advocate')}>
                                    <RadioButton
                                        checked={role === 'advocate'}
                                        onChange={() => !isLoading && handleRoleChange('advocate')}
                                        disabled={isLoading}
                                    />
                                    <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                                        Advocate
                                    </span>
                                </div>
                                <div className={cn("flex gap-1 items-center", isLoading && "opacity-50 pointer-events-none")} onClick={() => !isLoading && handleRoleChange('student')}>
                                    <RadioButton
                                        checked={role === 'student'}
                                        onChange={() => !isLoading && handleRoleChange('student')}
                                        disabled={isLoading}
                                    />
                                    <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                                        Law student
                                    </span>
                                </div>
                            </div>
                        </div>
                        {errors.role && <p className="text-textinput-color-text-helper-error text-xs ml-1">{errors.role}</p>}
                    </div>
                </div>


                {/* Terms Checkbox */}
                <div className="flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                        <Checkbox
                            id="terms"
                            checked={formData.terms}
                            onCheckedChange={(checked) => handleTermsChange(checked as boolean)}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="terms"
                            className="p-1 text-color-text-neutral-default text-style-textblock-primary-subtext-regular"
                        >
                            I agree to the <span className="text-color-text-primary-default">terms and conditions</span> and <span className="text-color-text-primary-default">privacy policy</span>
                        </label>
                    </div>
                    {errors.terms && <p className="text-textinput-color-text-helper-error text-xs ml-8">{errors.terms}</p>}
                </div>

                {/* Continue Button */}
                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full h-11 button-border-radius-default"
                        size="large"
                        disabled={isLoading}
                        onClick={handleSubmit}
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
