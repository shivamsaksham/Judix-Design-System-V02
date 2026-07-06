import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && fileUrl) {
      setLoading(true);
      setError(null);
      // Fetch the PDF using fetch to automatically include cookies
      fetch(fileUrl, { credentials: "include" }) // Include credentials to pass authentication cookies
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch PDF");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load PDF document.");
          setLoading(false);
        });
    } else {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
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
