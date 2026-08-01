import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { showToast } from "../ui/toast";

interface PdfViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string | null;
  title?: string;
}

export function PdfViewerDialog({
  open,
  onOpenChange,
  fileUrl,
  title = "SCR Copy",
}: PdfViewerDialogProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loading = open && !!fileUrl && !blobUrl && !error;

  useEffect(() => {
    if (!open || !fileUrl) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    // Fetch the PDF using fetch to automatically include cookies
    fetch(fileUrl, { credentials: "include" }) // Include credentials to pass authentication cookies
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || "Downloading judgment PDFs is not available on your current plan.");
          }
          throw new Error("Failed to fetch PDF");
        }
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        const message = err instanceof Error && err.message ? err.message : "Failed to load PDF document.";
        setError(message);
        showToast.alert(message);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setBlobUrl(null);
      setError(null);
    };
  }, [open, fileUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-5xl xl:max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-4">
          {loading && (
            <div className="flex items-center justify-center h-full w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full w-full text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && blobUrl && (
            <div className="w-full h-full">
              <iframe
                src={blobUrl}
                className="w-full h-full border-none rounded-md shadow-sm bg-white"
                title="PDF Viewer"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
