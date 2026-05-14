import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";

interface LinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialUrl?: string;
    onSave: (url: string) => void;
}

export function LinkDialog({
    open,
    onOpenChange,
    initialUrl = "",
    onSave,
}: LinkDialogProps) {
    const [url, setUrl] = React.useState(initialUrl);

    React.useEffect(() => {
        if (open) {
            setUrl(initialUrl || "");
        }
    }, [open, initialUrl]);

    const handleSave = () => {
        onSave(url);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-color-surface-neutral-default border border-color-border-neutral-default">
                <DialogHeader>
                    <DialogTitle className="text-style-body-title-regular">Add Link</DialogTitle>
                </DialogHeader>
                <div className="flex items-center py-2">
                    <TextInput
                        label="URL"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                        autoFocus
                    />
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button variant="neutral" onClick={() => onOpenChange(false)} size="small">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} size="small">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
