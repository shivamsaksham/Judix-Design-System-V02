import { type Editor } from '@tiptap/react';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { NotesPDFDocument } from './notes-pdf-document';


export const downloadNotesAsPDF = async (editor: Editor, title: string) => {
    if (!editor) return;

    try {
        const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        const content = editor.getJSON();

        // Generate PDF Blob using React-PDF
        const blob = await pdf(<NotesPDFDocument content={ content } title = { title } />).toBlob();
        const file = new File([blob], fileName, { type: 'application/pdf' });

        // Share or Save
        if (navigator.share && navigator.canShare) {
            const shareData = {
                files: [file],
                title: title,
                text: 'Here are my notes.',
            };

            if (navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                    return;
                } catch (err) {
                    // User cancelled or share failed
                }
            }
        }

        // Fallback to direct download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Failed to generate/download PDF:", error);
    }
};
