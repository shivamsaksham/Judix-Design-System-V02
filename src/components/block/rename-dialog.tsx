"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../ui/dialog";
import { Button } from "../ui/button";
import { TextInput } from "../ui/text-input";

export interface RenameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentName?: string;
    onSave: (newName: string) => void | Promise<void>;
    className?: string;
    minLength?: number;
}

function RenameDialog({
    open,
    onOpenChange,
    currentName = "",
    onSave,
    className,
    minLength = 3
}: RenameDialogProps) {
    const [name, setName] = React.useState(currentName);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setName(currentName);
            setIsSaving(false);
        }
    }, [open, currentName]);

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            await onSave(name);
            onOpenChange(false);
        } catch {
            // Failure is already surfaced by the onSave handler — leave the
            // dialog open with the loading state cleared so the user can retry.
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn("w-[480px] gap-6 bg-color-surface-neutral-default border border-color-border-neutral-default", className)}
                showCloseButton={true}
            >
                <DialogHeader>
                    <DialogTitle className="text-style-body-title-regular">Rename</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <TextInput
                        inputSize="medium"
                        label=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Existing name"
                        className="bg-color-textinput-bg [&_input]:h-8"
                    />
                </div>

                <DialogFooter className="flex-row justify-end space-x-2">
                    <Button variant="neutral" size="small" onClick={() => onOpenChange(false)} disabled={isSaving} className="text-style-body-default-regular">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={handleSave}
                        loading={isSaving}
                        disabled={name.trim().length < minLength}
                        className="h-auto"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

RenameDialog.displayName = "RenameDialog";

export { RenameDialog };
