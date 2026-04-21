"use client";

import React, { useState } from "react";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
});

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-medium text-gray-500 mb-4 mt-6 uppercase tracking-wide">
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
  children,
}: {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${disabled ? "opacity-60" : ""}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="h-12 w-full">
          <SelectValue placeholder={placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-50">
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}

function FileUploadButton({
  initialLabel,
  disabled,
}: {
  initialLabel: string;
  disabled?: boolean;
}) {
  const [fileName, setFileName] = useState(initialLabel);

  return (
    <label
      className={`inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm w-fit transition-colors
        ${disabled
          ? "opacity-60 cursor-not-allowed bg-gray-50"
          : "cursor-pointer hover:bg-gray-50"
        }`}
    >
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-gray-700">{fileName}</span>
      <input
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
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

export function MyAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState<Role>("");
  const [savedRole, setSavedRole] = useState<Role>("");

  const userData = fetchUserData();
  const [formData, setFormData] = useState<FormData>(userData);
  const [savedData, setSavedData] = useState<FormData>(userData);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setSavedData(formData);
    setSavedRole(role);
    setIsEditing(true);
  };

  const handleSave = () => {
    setSavedData(formData);
    setSavedRole(role);
    setIsEditing(false);
    // TODO: call API to persist saved profile
    console.log("Profile saved:", { role, ...formData });
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

  return (
    <div className="w-full max-w-[696px] md:max-w-3xl lg:max-w-4xl bg-white">

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
        <p className="text-xs text-gray-400 mt-1">
          Member since : 11 April, 2026
          {/* TODO: replace with actual member since date from user data */}
        </p>
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
        />
        <TextInput
          label="Last name"
          value={formData.lastName}
          placeholder="Enter your last name"
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <TextInput
          label="Mobile"
          value={formData.mobile}
          placeholder="Your registered mobile"
          disabled
        />
        <TextInput
          label="Email"
          value={formData.email}
          placeholder="Your registered email"
          disabled
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <SelectField
          label="Gender"
          value={formData.gender}
          placeholder="Select gender"
          onValueChange={(val) => handleChange("gender", val)}
          disabled={!isEditing}
        >
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectField>

        <SelectField
          label="State"
          value={formData.state}
          placeholder="Select state"
          onValueChange={(val) => handleChange("state", val)}
          disabled={!isEditing}
        >
          <SelectItem value="outside-india">Outside India</SelectItem>
          <SelectItem value="bihar">Bihar</SelectItem>
          <SelectItem value="delhi">Delhi</SelectItem>
          <SelectItem value="maharashtra">Maharashtra</SelectItem>
        </SelectField>

        <div className="col-span-2">
          <TextInput
            label="Address"
            value={formData.address}
            placeholder="Enter your address"
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mt-3">
        <TextInput
          label="Pin Code"
          value={formData.pinCode}
          placeholder="Enter your pin code"
          onChange={(e) => handleChange("pinCode", e.target.value)}
          disabled={!isEditing}
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
            />
            <TextInput
              label="Bar registration year"
              value={formData.barRegYear}
              placeholder="e.g. 2019"
              onChange={(e) => handleChange("barRegYear", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-3">
            <FileUploadButton
              initialLabel="Upload bar registration ID"
              disabled={!isEditing}
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
            />
            <TextInput
              label="College email"
              value={formData.collegeEmail}
              placeholder="Enter your college email"
              onChange={(e) => handleChange("collegeEmail", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <TextInput
              label="Graduating year"
              value={formData.graduatingYear}
              placeholder="e.g. 2027"
              onChange={(e) => handleChange("graduatingYear", e.target.value)}
              disabled={!isEditing}
            />
            <TextInput
              label="College pin code"
              value={formData.collegePinCode}
              placeholder="Enter college pin code"
              onChange={(e) => handleChange("collegePinCode", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-3">
            <TextInput
              label="College address"
              value={formData.collegeAddress}
              placeholder="Enter college address"
              onChange={(e) => handleChange("collegeAddress", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-3">
            <FileUploadButton
              initialLabel="Upload student ID card"
              disabled={!isEditing}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-3 mt-8 mb-6">
        {isEditing ? (
          <>
            <Button variant="neutral" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <Button onClick={handleEdit}
            prefixIcon="edit-a"
          >
            Edit profile
          </Button>
        )}
      </div>
    </div>
  );
}