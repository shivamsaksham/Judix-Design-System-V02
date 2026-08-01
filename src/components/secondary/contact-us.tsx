"use client"

import * as React from "react"
import { Icon } from "@judix/icon"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dropdown } from "@/components/ui/dropdown"

/** Payload emitted by the contact form. All fields optional — the submit
  * button currently sends an empty object. */
export interface ContactFormData {
    topic?: string;
    subTopic?: string;
    description?: string;
}

export interface ContactUsProps {
  userName: string
  userId: string
  onSubmit?: (data: ContactFormData) => void
  className?: string
}

const PURPOSE_OPTIONS = [
  { value: "technical", title: "Technical Support" },
  { value: "billing", title: "Billing Inquiry" },
  { value: "feature", title: "Feature Request" },
  { value: "other", title: "Other" },
]

const DATE_OPTIONS = [
  { value: "today", title: "Today" },
  { value: "tomorrow", title: "Tomorrow" },
]

const TIME_OPTIONS = [
  { value: "morning", title: "Morning (9 AM - 12 PM)" },
  { value: "afternoon", title: "Afternoon (12 PM - 5 PM)" },
]

export function ContactUs({
  userName,
  userId,
  onSubmit,
  className,
}: ContactUsProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [purpose, setPurpose] = React.useState<string | null>(null)
  const [date, setDate] = React.useState<string | null>(null)
  const [time, setTime] = React.useState<string | null>(null)
  
  const [isPurposeOpen, setIsPurposeOpen] = React.useState(false)
  const [isDateOpen, setIsDateOpen] = React.useState(false)
  const [isTimeOpen, setIsTimeOpen] = React.useState(false)

  const handleTriggerFileSelect = () => {
    inputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectedFiles = Array.from(e.target.files || [])
    // Handle files if needed
  }

  const getSelectedTitle = (options: Array<{ value: string; title: string }>, value: string | null, placeholder: string) => {
    const option = options.find(o => o.value === value)
    return option ? option.title : placeholder
  }

  return (
    <div className={cn("w-full pb-33 flex flex-col gap-6 bg-color-surface-neutral-default", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="p-1 text-style-heading-xs-emphasis text-color-text-neutral-default">Contact us</h1>
        <Separator className="bg-color-border-neutral-default" />
      </div>

      <div className="flex flex-col gap-6">
        {/* User Info */}
        <div className="flex flex-col">
          <h2 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">{userName}</h2>
          <p className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
            User id : {userId}
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 max-w-[800px]">
          {/* Purpose */}
          <div className="flex flex-col gap-1">
            <label className="textinput-font-label text-textinput-color-text-label">Purpose</label>
            <Popover open={isPurposeOpen} onOpenChange={setIsPurposeOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-between w-full h-[48px] px-3 border border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default text-style-body-default-regular text-color-text-neutral-tertiary hover:bg-color-surface-neutral-subtle transition-colors">
                  <span className={purpose ? "text-color-text-neutral-default" : "text-color-text-neutral-tertiary"}>
                    {getSelectedTitle(PURPOSE_OPTIONS, purpose, "Select an option")}
                  </span>
                  <Icon name="arrow-down-c" className="w-4 h-4 text-color-icon-neutral-secondary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none bg-transparent shadow-none w-(--radix-popover-trigger-width)]" align="start">
                <Dropdown
                  options={PURPOSE_OPTIONS}
                  value={purpose}
                  onChange={(val) => {
                    setPurpose(val)
                    setIsPurposeOpen(false)
                  }}
                  searchbar="off"
                  className="w-full"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preferred Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="textinput-font-label text-textinput-color-text-label">Preferred date</label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-between w-full h-[48px] px-3 border border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default text-style-body-default-regular text-color-text-neutral-tertiary hover:bg-color-surface-neutral-subtle transition-colors">
                    <span className={date ? "text-color-text-neutral-default" : "text-color-text-neutral-tertiary"}>
                      {getSelectedTitle(DATE_OPTIONS, date, "Select date")}
                    </span>
                    <Icon name="arrow-down-c" className="w-4 h-4 text-color-icon-neutral-secondary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-none bg-transparent shadow-none w-(--radix-popover-trigger-width)]" align="start">
                  <Dropdown
                    options={DATE_OPTIONS}
                    value={date}
                    onChange={(val) => {
                      setDate(val)
                      setIsDateOpen(false)
                    }}
                    searchbar="off"
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1">
              <label className="textinput-font-label text-textinput-color-text-label">Preferred time</label>
              <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-between w-full h-[48px] px-3 border border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default text-style-body-default-regular text-color-text-neutral-tertiary hover:bg-color-surface-neutral-subtle transition-colors">
                    <span className={time ? "text-color-text-neutral-default" : "text-color-text-neutral-tertiary"}>
                      {getSelectedTitle(TIME_OPTIONS, time, "Select time")}
                    </span>
                    <Icon name="arrow-down-c" className="w-4 h-4 text-color-icon-neutral-secondary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-none bg-transparent shadow-none w-(--radix-popover-trigger-width)]" align="start">
                  <Dropdown
                    options={TIME_OPTIONS}
                    value={time}
                    onChange={(val) => {
                      setTime(val)
                      setIsTimeOpen(false)
                    }}
                    searchbar="off"
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Describe issue */}
          <Textarea
            label="Describe your issue"
            placeholder="Describe your issue here"
            className="min-h-[200px] border-color-border-neutral-default rounded-radius-interactiveelement"
          />

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
              onChange={handleFileInputChange}
            />
            <div
              className="flex flex-col items-center justify-center p-6 border border-dashed border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle transition-colors cursor-pointer w-full gap-4"
              onClick={handleTriggerFileSelect}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center mt-5 ">
                <Icon name="export-d" className="w-6 h-6 text-color-icon-neutral-default" />
                <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">Upload supporting files</span>
                </div>
                <p className="w-full p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-tertiary text-center">
                  jpg, png, webp, jpeg, pdf, doc and docx supported. max 10 MB per file
                </p>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <Icon name="lock-a" className="w-4 h-4 text-color-icon-neutral-tertiary" />
                <span className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">AES-256 encrypted</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex">
            <Button
              variant="primary"
              size="small"
              onClick={() => onSubmit?.({})}
            >
              Submit request
            </Button>
          </div>
        </div>

        {/* Support Footer */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center flex-wrap text-style-body-default-regular text-color-text-neutral-secondary">
            <span className="p-1">Contact us directly on</span>
            <a href="#" className="p-1 text-color-text-feedback-info-default hover:underline cursor-pointer">
              WhatsApp
            </a>
            <span className="p-1">or email us at</span>
            <a href="mailto:support@judix.in" className="p-1 text-color-text-feedback-info-default hover:underline cursor-pointer">
              support@judix.in
            </a>
          </div>
          <p className="p-1 text-style-body-default-regular italic text-color-text-neutral-secondary">
            We usually reply within 2 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
