"use client";

import * as React from "react";
import { Icon } from "@judix/icon";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { IconButton } from "../ui/icon-button";
import { showToast } from "../ui/toast";
import { TextInput } from "../ui/text-input";

export interface ShareRecipient {
    id: string;
    name: string;
    email: string;
    isConfirmed: boolean;
}

export interface ShareSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shareLink: string;
    onShare: (recipients: ShareRecipient[], note: string) => Promise<boolean | void>;
    onCopyLink: () => void;
    onDownloadPdf: () => void;
    className?: string;
}

function ShareSearchDialog({
    open,
    onOpenChange,
    shareLink,
    onShare,
    onCopyLink,
    onDownloadPdf,
    className
}: ShareSearchDialogProps) {
    const [emailInput, setEmailInput] = React.useState("");
    const [recipients, setRecipients] = React.useState<ShareRecipient[]>([]);
    const [note, setNote] = React.useState("");
    const [showNoteInput, setShowNoteInput] = React.useState(false);
    const [isSharing, setIsSharing] = React.useState(false);
    const validateAndCreateRecipient = (email: string, currentRecipients: ShareRecipient[]): ShareRecipient | null => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return null;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) return null;

        const exists = currentRecipients.some((r) => r.email === trimmedEmail);
        if (exists) return null;

        return {
            id: crypto.randomUUID(),
            name: trimmedEmail.split("@")[0],
            email: trimmedEmail,
            isConfirmed: true
        };
    };

    const processInputAndAddRecipients = (inputValue: string) => {
        const parts = inputValue.split(/[,;]/);
        const newRecipients: ShareRecipient[] = [];

        parts.forEach((part) => {
            // We need to pass the most up-to-date list to validate for duplicates
            // Since newRecipients is local, we combine it with the state 'recipients'
            // NOTE: 'recipients' from closure might be stale if multiple updates happen quickly,
            // but for this synchronous operation it's fine.
            const combined = [...recipients, ...newRecipients];
            const r = validateAndCreateRecipient(part, combined);
            if (r) newRecipients.push(r);
        });

        if (newRecipients.length > 0) {
            setRecipients((prev) => [...prev, ...newRecipients]);
            return true; // Added something
        }
        return false;
    };

    const handleAddRecipient = () => {
        if (processInputAndAddRecipients(emailInput)) {
            setEmailInput("");
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailInput(e.target.value);
    };

    const handleConfirmRecipient = (id: string) => {
        setRecipients((prev) =>
            prev.map((r) => (r.id === id ? { ...r, isConfirmed: true } : r))
        );
    };

    const handleRemoveRecipient = (id: string) => {
        setRecipients((prev) => prev.filter((r) => r.id !== id));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === "," || event.key === ";") {
            event.preventDefault();
            handleAddRecipient();
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const success = await onShare(recipients, note);
            if (success !== false) {
                handleReset();
                onOpenChange(false);
            }
        } finally {
            setIsSharing(false);
        }
    };

    const handleCancel = () => {
        handleReset();
        onOpenChange(false);
    };

    const handleReset = () => {
        setEmailInput("");
        setRecipients([]);
        setNote("");
        setShowNoteInput(false);
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn("sm:max-w-[600px] p-6 rounded-2xl gap-6 bg-color-surface-neutral-default border border-color-border-neutral-default", className)}
                showCloseButton={true}
            >
                <DialogHeader className="flex-row items-center gap-2">
                    <IconButton
                        icon="share-a"
                        size="medium"
                        variant="primary"
                        boundary="none"
                    />
                    <DialogTitle className="text-style-body-title-regular">Share this search</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 min-w-0 w-full overflow-hidden">
                    <div className="flex flex-col gap-3 min-w-0">
                        <div className="flex flex-col gap-2 min-w-0">
                            <TextInput
                                inputSize="small"
                                label=""
                                className="h-[42px] items-center px-3 py-2"
                                type="email"
                                placeholder="Email ID"
                                value={emailInput}
                                onChange={handleEmailChange}
                                onKeyDown={handleKeyDown}
                                trailingAccessory={
                                    <IconButton
                                        icon="send-a"
                                        size="medium"
                                        variant="primary"
                                        boundary="none"
                                        onClick={handleAddRecipient}
                                        disabled={!emailInput.trim()}
                                    />
                                }
                            />

                            {recipients.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {recipients.map((recipient) => (
                                        <Label
                                            key={recipient.id}
                                            colorScheme="primary"
                                            size="medium"
                                            selected={recipient.isConfirmed}
                                            onRemove={
                                                recipient.isConfirmed
                                                    ? () => handleRemoveRecipient(recipient.id)
                                                    : undefined
                                            }
                                            onClick={
                                                !recipient.isConfirmed
                                                    ? () => handleConfirmRecipient(recipient.id)
                                                    : undefined
                                            }
                                            className={cn({
                                                "cursor-pointer text-style-body-default-regular": !recipient.isConfirmed
                                            })}
                                        >
                                            {recipient.name}
                                            {!recipient.isConfirmed && " +"}
                                        </Label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!showNoteInput ? (
                            <Button
                                variant="neutral"
                                size="small"
                                prefixIcon="document-a"
                                iconClassName="text-color-icon-neutral-tertiary"
                                className="w-fit px-3 py-[6px] border-none bg-color-surface-neutral-default text-color-text-neutral-tertiary text-style-label-default-regular -my-1"
                                onClick={() => setShowNoteInput(true)}
                            >
                                Add note
                            </Button>
                        ) : (
                            <div className="relative">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    onBlur={(e) => {
                                        if (e.target.value.trim() === "") {
                                            setShowNoteInput(false);
                                            setNote("");
                                        }
                                    }}
                                    placeholder="Add a note..."
                                    className="w-full min-h-[80px] p-3 rounded-lg border border-color-border-neutral-default bg-color-surface-neutral-default text-style-body-default-regular outline-none resize-y"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 w-full overflow-hidden">
                        <TextInput
                            inputSize="small"
                            label=""
                            value={shareLink}
                            className="h-[42px] items-center text-style-body-default-regular px-3 py-2"
                            readOnly
                            trailingAccessory={
                                <Button
                                    variant="neutral"
                                    size="extraSmall"
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareLink);
                                        onCopyLink();
                                        showToast.success("Link copied");
                                    }}
                                    className="p-2 w-[79px] h-[24px]"
                                >
                                    Copy link
                                </Button>
                            }
                        />
                        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                            Anyone with the link can view
                        </span>
                    </div>

                    {/* <Button
                        type="button"
                        variant="neutral"
                        onClick={onDownloadPdf}
                        prefixIcon="document-download"
                        size="extraSmall"
                        className="w-fit"
                    >
                        Download as PDF
                    </Button> */}
                </div>

                <DialogFooter>
                    <Button variant="neutral" size="small" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        size={"small"}
                        onClick={handleShare}
                        disabled={!shareLink || isSharing}
                        loading={isSharing}
                    >
                        Share
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

ShareSearchDialog.displayName = "ShareSearchDialog";

export { ShareSearchDialog };
