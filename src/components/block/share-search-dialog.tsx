"use client";

import * as React from "react";
import { Icon } from "judix-icon";
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
    onShare: (recipients: ShareRecipient[], note: string) => void;
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

    const handleShare = () => {
        onShare(recipients, note);
        handleReset();
    };

    const handleCancel = () => {
        handleReset();
        onOpenChange(false);
    };

    const handleReset = () => {
        setEmailInput("");
        setRecipients([]);
        setNote("");
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn("sm:max-w-[600px] p-6 rounded-2xl gap-6 bg-color-surface-neutral-default", className)}
                showCloseButton={true}
            >
                <DialogHeader className="flex-row items-center gap-2">
                    <Icon
                        name="Share"
                        className="h-5 w-5 text-icon_button-color-primary-icon"
                    />
                    <DialogTitle>Share this search</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <TextInput
                            label=""
                            className="h-[42px] items-center"
                            type="email"
                            placeholder="Email ID"
                            value={emailInput}
                            onChange={handleEmailChange}
                            onKeyDown={handleKeyDown}
                            trailingAccessory={
                                <IconButton
                                    icon="Send2"
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
                                            "cursor-pointer": !recipient.isConfirmed
                                        })}
                                    >
                                        {recipient.name}
                                        {!recipient.isConfirmed && " +"}
                                    </Label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <TextInput
                            label=""
                            placeholder="Add note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            leadingIcon={
                                <Icon
                                    name="DocumentText1"
                                    className="h-4 w-4 text-color-text-neutral-secondary"
                                />
                            }
                            className="border-none bg-transparent shadow-none focus-within:border-none p-0 h-[42px] items-center"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <TextInput
                            label=""
                            value={shareLink}
                            className="h-[42px] items-center"
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
                                >
                                    Copy link
                                </Button>
                            }
                        />
                        <span className="text-sm text-color-text-neutral-tertiary">
                            Anyone with the link can view
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="neutral"
                        onClick={onDownloadPdf}
                        prefixIcon="DocumentDownload"
                        size="extraSmall"
                        className="w-full justify-center sm:w-auto self-start"
                    >
                        Download as PDF
                    </Button>
                </div>

                <DialogFooter>
                    <Button variant="neutral" size="small" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={handleShare}
                        disabled={recipients.filter((r) => r.isConfirmed).length === 0}
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
