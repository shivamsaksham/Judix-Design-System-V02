import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { showToast } from "../ui/toast";

interface PdfViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string | null;
  title?: string;
}

const MOBILE_QUERY = "(max-width: 768px)";

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function PdfViewerDialog({
  open,
  onOpenChange,
  fileUrl,
  title = "SCR Copy",
}: PdfViewerDialogProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobileViewport();

  const loading = open && !!fileUrl && !isMobile && !blobUrl && !error;

  useEffect(() => {
    if (!open || !fileUrl || isMobile) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    fetch(fileUrl, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || "Downloading judgment PDFs is not available on your current plan.");
          }
          if (response.status === 401) {
            throw new Error("Please sign in again to view this document.");
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
  }, [open, fileUrl, isMobile]);

  const openInNewTab = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-5xl xl:max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle className="pr-8 text-left">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-4">
          {isMobile ? (
            <div className="flex flex-col items-center justify-center h-full w-full gap-4 px-6 text-center">
              <p className="text-style-body-default-regular text-color-text-neutral-secondary">
                Open the judgment copy in your device&apos;s PDF viewer.
              </p>
              <Button variant="primary" onClick={openInNewTab} disabled={!fileUrl}>
                Open PDF
              </Button>
            </div>
          ) : (
            <>
              {loading && (
                <div className="flex items-center justify-center h-full w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center h-full w-full gap-4 px-6 text-center">
                  <p className="text-color-text-feedback-negative-default">{error}</p>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
