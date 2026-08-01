"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dropdown } from "@/components/ui/dropdown";
import { Icon } from "@judix/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";

type Role = "student" | "professional" | "";

type FormData = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender: string;
  state: string;
  address: string;
  pinCode: string;
  // Professional fields
  barRegNumber: string;
  barRegYear: string;
  practiceForm: string;
  currentCourt: string;
  practiceArea: string;
  // Student fields
  collegeName: string;
  collegeEmail: string;
  graduatingYear: string;
  collegePinCode: string;
  collegeAddress: string;
  idCardPhotoUrl?: string;
  registrationIdUrl?: string;
};

const fetchUserData = (): FormData => ({
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  gender: "",
  state: "",
  address: "",
  pinCode: "",
  barRegNumber: "",
  barRegYear: "",
  practiceForm: "",
  currentCourt: "",
  practiceArea: "",
  collegeName: "",
  collegeEmail: "",
  graduatingYear: "",
  collegePinCode: "",
  collegeAddress: "",
  idCardPhotoUrl: "",
  registrationIdUrl: "",
});

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="p-1 text-style-label-default-emphasis text-color-text-neutral-tertiary mb-4 mt-6 uppercase">
      {title}
    </h2>
  );
}

function SelectField({
  label,
  value,
  onValueChange,
  disabled,
  placeholder,
  options,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options: { value: string; title: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.title : "";

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full cursor-pointer">
            <TextInput
              label={label}
              value={displayText}
              placeholder={placeholder ?? "Select..."}
              disabled={disabled}
              readOnly
              inputSize="small"
              className="cursor-pointer"
              inputClassName="cursor-pointer select-none"
              trailingAccessory={
                <Icon
                  name="arrow-down-c"
                  className="w-4 h-4 text-color-icon-neutral-secondary shrink-0"
                />
              }
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 border-none bg-transparent shadow-none" 
          style={{ width: "var(--radix-popover-trigger-width)" }}
          align="start"
        >
          <Dropdown
            options={options}
            value={value}
            onChange={(val) => {
              onValueChange(val);
              setOpen(false);
            }}
            searchbar="off"
            className="w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function FileUploadButton({
  initialLabel,
  disabled,
  value,
  onChange,
}: {
  initialLabel: string;
  disabled?: boolean;
  value?: string;
  onChange?: (val: string) => void;
}) {
  const [fileName, setFileName] = useState(value ? "Uploaded Document" : initialLabel);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (value) {
      setIsViewOpen(true);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(initialLabel);
    onChange?.("");
  };

  if (value) {
    return (
      <>
      <div className="flex items-center justify-between border border-color-border-neutral-default rounded-radius-interactiveelement px-4 py-2 bg-color-surface-neutral-subtle_bg w-full sm:w-fit gap-6">
        <div className="flex items-center gap-2 text-style-body-default-regular text-color-text-neutral-default min-w-0">
          <Icon
            name="document-a"
            className="w-4 h-4 text-color-icon-neutral-secondary shrink-0"
          />
          <span className="p-1 max-w-[200px] truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="neutral"
            size="extraSmall"
            onClick={handleView}
          >
            View
          </Button>
          {!disabled && (
            <Button
              type="button"
              variant="neutral"
              size="extraSmall"
              onClick={handleDelete}
              className="text-color-icon-feedback-error-default! hover:bg-color-surface-feedback-error-disabled!"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4">
             <img src={value} alt="Document preview" className="max-h-[70vh] object-contain" />
          </div>
        </DialogContent>
      </Dialog>
      </>
    );
  }

  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 border border-color-border-neutral-default rounded-radius-interactiveelement px-4 py-2 text-style-body-default-regular w-full sm:w-fit transition-colors",
        disabled
          ? "opacity-60 cursor-not-allowed bg-color-surface-neutral-hover_default text-color-text-neutral-disabled"
          : "cursor-pointer bg-color-surface-neutral-subtle_bg text-color-text-neutral-default hover:bg-color-surface-neutral-subtle"
      )}
    >
      <Icon
        name="document-a"
        className="w-4 h-4 text-color-icon-neutral-secondary shrink-0"
      />
      <span className="p-1">{fileName}</span>
      <input
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              onChange?.(base64);
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </label>
  );
}

function RoleSelector({
  value,
  onChange,
  disabled,
}: {
  value: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
}) {
  const options: { label: string; value: Role; description: string }[] = [
    {
      label: "Student",
      value: "student",
      description: "Currently enrolled in a law college",
    },
    {
      label: "Working Professional",
      value: "professional",
      description: "Practising advocate / legal professional",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.value)}
            className={`
              flex flex-col items-start gap-0.5 rounded-lg border-2 px-4 py-3 text-left transition-all
              ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${active
                ? "border-teal-600 bg-teal-50"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            <span
              className={`text-sm font-medium ${active ? "text-teal-700" : "text-gray-700"
                }`}
            >
              {opt.label}
            </span>
            <span className="text-xs text-gray-400">{opt.description}</span>
          </button>
        );
      })}
    </div>
  );
}

const GENDER_OPTIONS = [
  { value: "male", title: "Male" },
  { value: "female", title: "Female" },
  { value: "other", title: "Other" },
];

const STATE_OPTIONS = [
  { value: "outside-india", title: "Outside India" },
  { value: "bihar", title: "Bihar" },
  { value: "delhi", title: "Delhi" },
  { value: "maharashtra", title: "Maharashtra" },
];

/** Fields MyAccount reads off the user record. Several are historical aliases
  * for the same value, so all are optional. */
export interface AccountProfile {
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  mobileNumber?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  state?: string;
  address?: string | { street?: string; city?: string; state?: string; zipCode?: string };
  addressString?: string;
  pinCode?: string;
  barRegNumber?: string;
  barRegYear?: string;
  practiceForm?: string;
  currentCourt?: string;
  practiceArea?: string;
  collegeName?: string;
  collegeEmail?: string;
  graduatingYear?: string;
  collegePinCode?: string;
  collegeAddress?: string;
  idCardPhotoUrl?: string;
  registrationIdUrl?: string;
  createdAt?: string | Date;
}

export type AccountFormValues = FormData & { role: Role };

function toRole(value: string | undefined): Role {
  return value === "student" || value === "professional" ? value : "professional";
}

export function MyAccount({ profile, onSave }: { profile?: AccountProfile | null, onSave?: (data: AccountFormValues) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [role, setRole] = useState<Role>(toRole(profile?.role));
  const [savedRole, setSavedRole] = useState<Role>(toRole(profile?.role));

  const [formData, setFormData] = useState<FormData>({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    mobile: profile?.phoneNumber || profile?.phone || profile?.mobileNumber || profile?.mobile || "",
    email: profile?.email || "",
    gender: profile?.gender || "",
    state: profile?.state || "",
    address: (typeof profile?.address === "string" ? profile.address : profile?.addressString) || "",
    pinCode: profile?.pinCode || "",
    barRegNumber: profile?.barRegNumber || "",
    barRegYear: profile?.barRegYear || "",
    practiceForm: profile?.practiceForm || "",
    currentCourt: profile?.currentCourt || "",
    practiceArea: profile?.practiceArea || "",
    collegeName: profile?.collegeName || "",
    collegeEmail: profile?.collegeEmail || "",
    graduatingYear: profile?.graduatingYear || "",
    collegePinCode: profile?.collegePinCode || "",
    collegeAddress: profile?.collegeAddress || "",
    idCardPhotoUrl: profile?.idCardPhotoUrl || "",
    registrationIdUrl: profile?.registrationIdUrl || "",
  });
  const [savedData, setSavedData] = useState<FormData>(formData);

  React.useEffect(() => {
    if (profile) {
      const newFormData = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        mobile: profile.phoneNumber || profile.phone || profile.mobileNumber || profile.mobile || "",
        email: profile.email || "",
        gender: profile.gender || "",
        state: profile.state || "",
        address: (typeof profile.address === "string" ? profile.address : profile.addressString) || "",
        pinCode: profile.pinCode || "",
        barRegNumber: profile.barRegNumber || "",
        barRegYear: profile.barRegYear || "",
        practiceForm: profile.practiceForm || "",
        currentCourt: profile.currentCourt || "",
        practiceArea: profile.practiceArea || "",
        collegeName: profile.collegeName || "",
        collegeEmail: profile.collegeEmail || "",
        graduatingYear: profile.graduatingYear || "",
        collegePinCode: profile.collegePinCode || "",
        collegeAddress: profile.collegeAddress || "",
        idCardPhotoUrl: profile.idCardPhotoUrl || "",
        registrationIdUrl: profile.registrationIdUrl || "",
      };
      setFormData(newFormData);
      setSavedData(newFormData);
      setRole(toRole(profile.role));
      setSavedRole(toRole(profile.role));
    }
  }, [profile]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setSavedData(formData);
    setSavedRole(role);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const dataToSave = { role, ...formData };
    if (onSave) {
      setIsSaving(true);
      try {
        await showToast.promise(
          onSave(dataToSave),
          {
            loading: "Saving your profile...",
            success: "Profile saved successfully!",
            error: "Failed to save profile.",
          }
        );
        setSavedData(formData);
        setSavedRole(role);
        setIsEditing(false);
      } catch (error) {
        // error is handled by showToast.promise
      } finally {
        setIsSaving(false);
      }
    } else {
      setSavedData(formData);
      setSavedRole(role);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(savedData);
    setRole(savedRole);
    setIsEditing(false);
  };

  const displayName =
    formData.firstName || formData.lastName
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : "Your Name";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="w-full bg-white">

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{displayName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {role === "student"
              ? "Student"
              : role === "professional"
                ? "Advocate"
                : "Advocate"}
          </p>
        </div>
        {memberSince && (
          <p className="text-xs text-gray-400 mt-1">
            Member since : {memberSince}
          </p>
        )}
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Role selector */}
      <SectionHeader title="I am a" />
      <RoleSelector value={role} onChange={setRole} disabled={!isEditing} />

      <hr className="my-6 border-gray-200" />

      {/* Personal Information */}
      <SectionHeader title="Personal Information" />

      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="First name"
          value={formData.firstName}
          placeholder="Enter your first name"
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={!isEditing}
          inputSize="small"
        />
        <TextInput
          label="Last name"
          value={formData.lastName}
          placeholder="Enter your last name"
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={!isEditing}
          inputSize="small"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <TextInput
          label="Mobile"
          value={formData.mobile}
          placeholder="Your registered mobile"
          disabled
          inputSize="small"
        />
        <TextInput
          label="Email"
          value={formData.email}
          placeholder="Your registered email"
          disabled
          inputSize="small"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <SelectField
          label="Gender"
          value={formData.gender}
          placeholder="Select gender"
          onValueChange={(val) => handleChange("gender", val)}
          disabled={!isEditing}
          options={GENDER_OPTIONS}
        />

        <SelectField
          label="State"
          value={formData.state}
          placeholder="Select state"
          onValueChange={(val) => handleChange("state", val)}
          disabled={!isEditing}
          options={STATE_OPTIONS}
        />

        <div className="col-span-2">
          <TextInput
            label="Pin Code"
            value={formData.pinCode}
            placeholder="Enter your pin code"
            onChange={(e) => handleChange("pinCode", e.target.value)}
            disabled={!isEditing}
            inputSize="small"
          />
        </div>
      </div>

      <div className="mt-3">
        <TextInput
          label="Address"
          value={formData.address}
          placeholder="Enter your address"
          onChange={(e) => handleChange("address", e.target.value)}
          disabled={!isEditing}
          inputSize="small"
        />
      </div>

      {/* ── Professional Information (only for working professionals) ── */}
      {role === "professional" && (
        <>
          <hr className="my-6 border-gray-200" />
          <SectionHeader title="Professional Information" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <TextInput
              label="Bar registration number"
              value={formData.barRegNumber}
              placeholder="e.g. DHC/219/2019"
              onChange={(e) => handleChange("barRegNumber", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
            <TextInput
              label="Bar registration year"
              value={formData.barRegYear}
              placeholder="e.g. 2019"
              onChange={(e) => handleChange("barRegYear", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
          </div>

          <div className="mt-3">
            <FileUploadButton
              initialLabel="Upload Bar Registration ID"
              disabled={!isEditing}
              value={formData.registrationIdUrl}
              onChange={(val) => handleChange("registrationIdUrl", val)}
            />
          </div>
        </>
      )}

      {/* ── Education Information (only for students) ── */}
      {role === "student" && (
        <>
          <hr className="my-6 border-gray-200" />
          <SectionHeader title="Education Information" />

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="College name"
              value={formData.collegeName}
              placeholder="Enter your college name"
              onChange={(e) => handleChange("collegeName", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
            <TextInput
              label="College email"
              value={formData.collegeEmail}
              placeholder="Enter your college email"
              onChange={(e) => handleChange("collegeEmail", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <TextInput
              label="Graduating year"
              value={formData.graduatingYear}
              placeholder="e.g. 2027"
              onChange={(e) => handleChange("graduatingYear", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
            <TextInput
              label="College pin code"
              value={formData.collegePinCode}
              placeholder="Enter college pin code"
              onChange={(e) => handleChange("collegePinCode", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
          </div>

          <div className="mt-3">
            <TextInput
              label="College address"
              value={formData.collegeAddress}
              placeholder="Enter college address"
              onChange={(e) => handleChange("collegeAddress", e.target.value)}
              disabled={!isEditing}
              inputSize="small"
            />
          </div>

          <div className="mt-3">
            <FileUploadButton
              initialLabel="Upload student ID card"
              disabled={!isEditing}
              value={formData.idCardPhotoUrl}
              onChange={(val) => handleChange("idCardPhotoUrl", val)}
            />
          </div>
        </>
      )}

      <div className="sticky bottom-0 bg-white border-t border-color-border-neutral-default py-4 mt-8 z-10 flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button variant="neutral" onClick={handleCancel} size="small" disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} size="small" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        ) : (
          <Button onClick={handleEdit}
            prefixIcon="edit-a"
            size="small"
          >
            Edit profile
          </Button>
        )}
      </div>
    </div>
  );
}