'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TextInput } from '../ui/text-input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import {
    Dropdown,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui';
import { Icon } from '@judix/icon';

export interface BillInfoFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    needGst: boolean;
    gstNumber: string;
}

export interface CompanyDetails {
    name: string;
    address: string;
    gst: string;
}

export interface BillInfoFormProps {
    initialData?: Partial<BillInfoFormData>;
    companyDetails?: CompanyDetails;
    onSave?: (data: BillInfoFormData) => void;
    onDiscard?: () => void;
    className?: string;
}

const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const BillInfoForm = ({
    initialData,
    companyDetails = {
        name: "JUDIX TECHNOLOGIES PRIVATE LIMITED",
        address: "Block A1, Chatrapati Shivaji Greens, Ektapuram, Patna 804453",
        gst: "10AGGD23556ND20"
    },
    onSave,
    onDiscard,
    className,
}: BillInfoFormProps) => {
    const [formData, setFormData] = useState<BillInfoFormData>({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        pincode: initialData?.pincode || '',
        needGst: initialData?.needGst || false,
        gstNumber: initialData?.gstNumber || '',
    });

    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                address: initialData.address || '',
                city: initialData.city || '',
                state: initialData.state || '',
                pincode: initialData.pincode || '',
                needGst: initialData.needGst || false,
                gstNumber: initialData.gstNumber || '',
            });
            setIsVerified(!!initialData.gstNumber);
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                needGst: false,
                gstNumber: '',
            });
            setIsVerified(false);
        }
    }, [initialData]);

    const handleVerify = () => {
        if (!formData.gstNumber) return;
        setIsVerifying(true);
        // Mock verification delay
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
            console.log("GST Verified");
        }, 1500);
    };

    const handleChange = (field: keyof BillInfoFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave?.(formData);
    };

    const handleDiscard = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            needGst: false,
            gstNumber: '',
        });
        onDiscard?.();
    };

    return (
        <div className={cn('flex flex-col gap-4 w-full max-w-2xl bg-color-surface-neutral-default', className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name & Last Name */}
                <TextInput
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    inputSize="medium"
                />
                <TextInput
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    inputSize="medium"
                />
            </div>

            {/* Phone */}
            <TextInput
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                inputSize="medium"
            />

            {/* Email */}
            <TextInput
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                inputSize="medium"
            />

            {/* Address */}
            <TextInput
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                inputSize="medium"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[11px]">
                {/* City */}
                <TextInput
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    inputSize="medium"
                />

                {/* State */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="neutral"
                            size="medium"
                            className="h-12 w-full justify-between text-style-body-default-regular px-3 border-textinput-color-stroke-default bg-textinput-bg font-normal"
                        >
                            <span className={cn(!formData.state && "text-color-text-neutral-placeholder")}>
                                {formData.state || "State"}
                            </span>
                            <Icon name="arrow-down-c" className="w-4 h-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-(--radix-popover-trigger-width) border-none shadow-none bg-transparent" align="start">
                        <Dropdown
                            options={STATES.map(state => ({ value: state, title: state }))}
                            value={formData.state}
                            onChange={(value) => handleChange('state', value)}
                            searchbar="attached"
                            className="w-full"
                        />
                    </PopoverContent>
                </Popover>

                {/* Pin code */}
                <TextInput
                    placeholder="Pin code"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    inputSize="medium"
                />
            </div>

            {/* Need GST Checkbox */}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="needGst"
                    size='medium'

                    checked={formData.needGst}
                    onCheckedChange={(checked) => handleChange('needGst', checked === true)}
                />
                <p className='p-1 text-style-body-default-regular text-color-text-neutral-secondary'>Need GST Bill?</p>
            </div>

            {/* GST Number Section */}
            {formData.needGst && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <TextInput
                        placeholder="GST number"
                        value={formData.gstNumber}
                        onChange={(e) => {
                            handleChange('gstNumber', e.target.value);
                            setIsVerified(false);
                        }}
                        inputSize="medium"
                        trailingAccessory={
                            <Label
                                colorScheme="primary"
                                size="small"
                                selected={true}
                                className={cn('bg-color-surface-neutral-default cursor-pointer', isVerifying && "opacity-50")}
                                onClick={handleVerify}
                            >
                                {isVerifying ? "Verifying..." : isVerified ? "Verified" : "Verify"}
                            </Label>
                        }   
                    />
                </div>
            )}

            <div className="flex flex-col">
                <h4 className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">
                    {companyDetails.name}
                </h4>
                <p className="p-1 text-style-label-default-regular text-color-text-neutral-default">
                    {companyDetails.address}
                </p>
                <p className="p-1 text-style-label-default-regular text-color-text-neutral-default">
                    {companyDetails.gst}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center py-2 gap-2">
                <Button
                    variant="primary"
                    size="small"
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    variant="neutral"
                    size="small"
                    onClick={handleDiscard}
                >
                    Discard
                </Button>
            </div>
        </div>
    );
};
