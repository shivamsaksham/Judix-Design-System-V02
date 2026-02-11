/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Link, Font } from '@react-pdf/renderer';
import { type JSONContent } from '@tiptap/react';

// Register a standard font that supports standard weights
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
    ],
});

const styles = StyleSheet.create({
    // Page Layout
    'page-layout': {
        padding: 40,
        fontFamily: 'Roboto',
        backgroundColor: '#FFFFFF', // bg-surface-neutral-default
    },

    // Typography Utilities (from globals.css)
    'text-style-heading-xl': { fontSize: 52, fontWeight: 700, lineHeight: 1.2 },
    'text-style-heading-lg': { fontSize: 40, fontWeight: 700, lineHeight: 1.2 },
    'text-style-heading-md': { fontSize: 32, fontWeight: 700, lineHeight: 1.2 },
    'text-style-heading-sm': { fontSize: 24, fontWeight: 700, lineHeight: 1.2 },
    'text-style-heading-xs': { fontSize: 20, fontWeight: 600, lineHeight: 1.2 },

    'text-style-body-default-regular': {
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: 'Roboto'
    },

    // Color Utilities (mapped from tokens)
    'text-neutral-default': { color: '#262626' },   // neutral-contrast-800
    'text-neutral-secondary': { color: '#3d3d3d' }, // neutral-contrast-700
    'text-neutral-tertiary': { color: '#666666' },  // neutral-mid-600
    'text-primary-default': { color: '#00808b' },   // primary-400

    'border-neutral-mid': { borderColor: '#b8b8b8' }, // neutral-mid-400
    'bg-surface-neutral-subtle': { backgroundColor: '#fbfbfa' }, // base-000

    // Spacing Utilities
    'mb-2': { marginBottom: 8 },
    'mb-3': { marginBottom: 12 },
    'mb-4': { marginBottom: 16 },
    'mb-5': { marginBottom: 20 },
    'mt-3': { marginTop: 12 },
    'mt-5': { marginTop: 20 },

    // Component Specific (simulating component classes)
    'list-item': {
        flexDirection: 'row',
        marginBottom: 4,
    },
    'listContent': {
        flex: 1,
    },
    'list-bullet': {
        width: 15,
        fontSize: 14,
        marginLeft: 20,
    },
    'blockquote': {
        marginVertical: 12,
        borderLeftWidth: 4,
        paddingLeft: 12,
        fontStyle: 'italic',
    },
    'image': {
        marginVertical: 12,
        maxWidth: '100%',
        objectFit: 'contain',
    },

    // Modifiers
    'font-bold': { fontWeight: 700 },
    'italic': { fontStyle: 'italic' },
    'underline': { textDecoration: 'underline' },
    'link': { textDecoration: 'underline' },
    'text-center': { textAlign: 'center' },
});

export interface NotesPDFDocumentProps {
    content: JSONContent;
    title: string;
}

const renderTextNodes = (content: JSONContent[]) => {
    return content.map((node, index) => {
        if (node.type === 'text') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const style: any[] = [];
            let isLink = false;
            let linkHref = '';

            if (node.marks) {
                node.marks.forEach(mark => {
                    if (mark.type === 'bold') style.push(styles['font-bold']);
                    if (mark.type === 'italic') style.push(styles['italic']);
                    if (mark.type === 'underline') style.push(styles['underline']);
                    if (mark.type === 'link') {
                        isLink = true;
                        linkHref = mark.attrs?.href;
                        style.push(styles['link']);
                        style.push(styles['text-primary-default']);
                    }
                });
            }

            if (isLink) {
                // Ensure absolute URL
                let safeHref = linkHref || '';

                if (safeHref.startsWith('/')) {
                    safeHref = typeof window !== 'undefined' ? `${window.location.origin}${safeHref}` : safeHref;
                } else if (!safeHref.startsWith('http') && !safeHref.startsWith('mailto:')) {
                    safeHref = `https://${safeHref}`;
                }

                return (
                    <Link key={index} src={safeHref} style={style}>
                        {node.text}
                    </Link>
                );
            }

            return <Text key={index} style={style}>{node.text}</Text>;
        }
        return null;
    });
};

const renderContent = (node: JSONContent, index: number): React.ReactNode => {
    // 1. Headings
    if (node.type === 'heading') {
        const level = node.attrs?.level || 1;

        // Map level to class names
        // Map level to class names
        let headingClass = styles['text-style-heading-lg'];
        let colorClass = styles['text-neutral-default'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let spacingStyles: any[] = [styles['mb-4']];

        if (level === 1) {
            headingClass = styles['text-style-heading-lg'];
            colorClass = styles['text-neutral-default'];
        }
        if (level === 2) {
            headingClass = styles['text-style-heading-md'];
            colorClass = styles['text-neutral-default'];
            spacingStyles = [styles['mt-5'], styles['mb-3']];
        }
        if (level === 3) {
            headingClass = styles['text-style-heading-sm'];
            colorClass = styles['text-neutral-default'];
            spacingStyles = [styles['mt-3'], styles['mb-2']];
        }
        if (level >= 4) {
            headingClass = styles['text-style-heading-xs'];
            colorClass = styles['text-neutral-secondary'];
            spacingStyles = [styles['mt-3'], styles['mb-2']];
        }

        const align = node.attrs?.textAlign;
        return (
            <Text key={index} style={[
                headingClass,
                colorClass,
                ...spacingStyles,
                align ? { textAlign: align } : {}
            ]}>
                {node.content ? renderTextNodes(node.content) : ''}
            </Text>
        );
    }

    // 2. Paragraphs
    if (node.type === 'paragraph') {
        const align = node.attrs?.textAlign;
        const imageNode = node.content?.find(c => c.type === 'image');
        if (imageNode && node.content?.length === 1) {
            return renderContent(imageNode, index);
        }

        return (
            <Text key={index} style={[
                styles['text-style-body-default-regular'],
                styles['text-neutral-default'],
                styles['mb-2'],
                align ? { textAlign: align } : {}
            ]}>
                {node.content ? renderTextNodes(node.content) : ''}
            </Text>
        );
    }

    // 3. Images
    if (node.type === 'image') {
        const src = node.attrs?.src;
        // Resolve path
        let safeSrc = src;
        if (src && src.startsWith('/')) {
            safeSrc = typeof window !== 'undefined' ? window.location.origin + src : src;
        }

        return safeSrc ? <Image key={index} style={styles['image']} src={safeSrc} /> : null;
    }

    // 4. Bullet List
    if (node.type === 'bulletList') {
        return (
            <View key={index}>
                {node.content?.map((listItem, i) => (
                    <View key={i} style={styles['list-item']}>
                        <Text style={[styles['list-bullet'], styles['text-neutral-default']]}>•</Text>
                        <View style={styles.listContent}>
                            {listItem.content?.map((c, j) => renderContent(c, j))}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    // 5. Ordered List
    if (node.type === 'orderedList') {
        return (
            <View key={index}>
                {node.content?.map((listItem, i) => (
                    <View key={i} style={styles['list-item']}>
                        <Text style={[styles['list-bullet'], styles['text-neutral-default']]}>{i + 1}.</Text>
                        <View style={styles.listContent}>
                            {listItem.content?.map((c, j) => renderContent(c, j))}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    // 6. Blockquote
    if (node.type === 'blockquote') {
        return (
            <View key={index} style={[
                styles['blockquote'],
                styles['border-neutral-mid'],
            ]}>
                {node.content?.map((c, i) => {
                    return renderContent(c, i);
                })}
            </View>
        )
    }

    return null;
};

export const NotesPDFDocument: React.FC<NotesPDFDocumentProps> = ({ content, title }) => {
    return (
        <Document title={title} author="Judix User">
            <Page size="A4" style={styles['page-layout']}>
                <Text style={[
                    styles['text-style-heading-sm'],
                    styles['text-center'],
                    styles['mb-5'],
                    styles['text-neutral-default']
                ]}>
                    {title}
                </Text>
                {content.content && content.content.map((node, index) => renderContent(node, index))}
            </Page>
        </Document>
    );
};
