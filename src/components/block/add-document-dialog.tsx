import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@judix/icon';
import { FileUploadItem, type FileUploadItemProps } from '@/components/block/file-upload-item';
import { cn } from '@/lib/utils';

export interface AddDocumentDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** List of files to display. If empty or not provided, shows the dropzone state. */
    files?: FileUploadItemProps[];
    onUploadClick?: () => void;
    onCancelClick?: () => void;
    onAddMoreFilesClick?: () => void;
    onDropzoneClick?: () => void;
    onFilesSelected?: (files: File[]) => void;
}

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
    open,
    onOpenChange,
    files = [],
    onUploadClick,
    onCancelClick,
    onAddMoreFilesClick,
    onDropzoneClick,
    onFilesSelected,
}) => {
    const hasFiles = files.length > 0;
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleTriggerFileSelect = () => {
        inputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            onFilesSelected?.(selectedFiles);
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            onFilesSelected?.(droppedFiles);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Hidden native file input */}
            <input 
                type="file" 
                ref={inputRef} 
                className="hidden" 
                multiple 
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange} 
            />
            
            <DialogContent 
                className="sm:max-w-[645px] w-[645px] h-[448px] flex flex-col gap-6 bg-color-surface-neutral-default border-color-border-neutral-default" 
                showCloseButton={true}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <DialogHeader className="-mt-1.5">
                    <DialogTitle className="text-style-body-default-regular text-color-text-primary-default">
                        Add document
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col w-full min-h-[290px]">
                    {!hasFiles ? (
                        /* Empty State: Dropzone */
                        <div 
                            className="flex flex-col items-center justify-between p-8 border-2 border-dashed border-color-border-neutral-default rounded-radius-md bg-color-surface-neutral-default hover:bg-color-surface-neutral-subtle transition-colors cursor-pointer w-full flex-1"
                            onClick={() => {
                                handleTriggerFileSelect();
                                onDropzoneClick?.();
                            }}
                        >
                            <div className="flex flex-col items-center justify-center flex-1 mt-6">
                                <Icon name="export-d" className="w-8 h-8 text-color-icon-neutral-default" />
                                <span className="p-1 text-style-body-default-regular text-color-text-neutral-default mb-1">Drag and drop files here</span>
                                <span className="p-1 text-style-label-default-regular text-color-text-neutral-default">or</span>
                                <span className="p-1 text-style-body-default-regular text-color-text-neutral-default mb-4">Browse files</span>
                                <span className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">pdf, doc and docx supported. max 10 MB per file</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-style-label-default-regular text-color-text-neutral-secondary">
                                <Icon name="lock-a" className="w-4 h-4" />
                                <span className='p-1 text-style-label-default-regular text-color-text-neutral-tertiary'>AES-256 encrypted</span>
                            </div>
                        </div>
                    ) : (
                        /* Added State: File List */
                        <div className="flex flex-col py-2 gap-5 w-full">
                            {files.map((file, index) => (
                                <React.Fragment key={index}>
                                    <FileUploadItem {...file} />
                                    {/* Separator between items, except for the last one */}
                                    {index < files.length - 1 && (
                                        <div className="h-[1px] w-full bg-color-border-neutral-default" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className={cn("flex w-full items-center", hasFiles ? "justify-between" : "justify-end")}>
                    {hasFiles && (
                        <Button 
                            variant="neutral" 
                            size='extraSmall' 
                            onClick={() => {
                                handleTriggerFileSelect();
                                onAddMoreFilesClick?.();
                            }}
                        >
                            Add more files
                        </Button>
                    )}
                    <div className="flex items-center gap-3">
                        <Button variant="neutral" size='extraSmall' onClick={onCancelClick || (() => onOpenChange?.(false))}>Cancel</Button>
                        <Button variant="primary" size='extraSmall' onClick={onUploadClick}>Upload files</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
