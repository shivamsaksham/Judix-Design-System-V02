"use client";
import React, { useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { IconButton, Button, Dropdown, DropdownOption } from "@/components/ui";
import {
    useFloating,
    offset,
    flip,
    shift,
    useDismiss,
    useInteractions,
    autoUpdate,
} from "@floating-ui/react";
import { createPortal } from "react-dom";
import NestedDropdown from "./custom-dropdown-helper";
import { SearchScopeSelector } from "./search-scope-selector";
import { ContextItem } from "./context-window";
import { CourtSelector, CourtCategory } from "./court-selector";
export interface OptionHelper extends DropdownOption {
    options?: DropdownOption[];
    Searchbar?: "off" | "attached" | "integrated";
}

const getAllValues = (options: OptionHelper[]): Set<string> => {
    const values = new Set<string>();
    const recurse = (opts: OptionHelper[]) => {
        opts.forEach((o) => {
            values.add(o.value);
            if (o.options) recurse(o.options);
        });
    };
    recurse(options);
    return values;
};

type TriggerType = string | null;


export interface TriggerConfig {
    options: OptionHelper[];
    renderType: "nested" | "flat";
}

export interface StaticDataConfig {
    [key: string]: DropdownOption[];
}



export interface SearchPayload {
    query: string;
    filters: any;
}

export interface TokenStructure {
    trigger: string;
    prefix: string;
    suffix: string;
    inputs: {
        placeholder?: string;
        prefix?: string;
        key?: string;
    }[];
}

export const DEFAULT_TOKEN_CONFIG: Record<string, TokenStructure> = {
    Year: {
        trigger: "Year",
        prefix: "[Year:-",
        suffix: "]",
        inputs: [{ key: "year" }]
    },
    Case: {
        trigger: "Case",
        prefix: "[Case:-",
        suffix: "]",
        inputs: [{ placeholder: "select", key: "case_type" }]
    },
    Judge: {
        trigger: "Judge",
        prefix: "[Judge:-",
        suffix: "]",
        inputs: [{ placeholder: "select", key: "judge" }]
    },
    Bench: {
        trigger: "Bench",
        prefix: "[Bench:-",
        suffix: "]",
        inputs: [{ key: "bench" }]
    },
    Act: {
        trigger: "Act",
        prefix: "[Act:- ",
        suffix: "]",
        inputs: [
            { placeholder: "name", key: "act_name" },
            { prefix: " ; Section:- ", placeholder: "section", key: "section" }
        ]
    },
    SCR: {
        trigger: "SCR",
        prefix: "[SCR:-",
        suffix: "]",
        inputs: [{ placeholder: "year volume SCR page", key: "scr_citation" }]
    },
    INSC: {
        trigger: "INSC",
        prefix: "[INSC:-",
        suffix: "]",
        inputs: [{ placeholder: "year INSC number", key: "insc_citation" }]
    },
    Appellant: {
        trigger: "Appellant",
        prefix: "[Appellant:-",
        suffix: "]",
        inputs: [{ key: "appellant" }]
    },
    Respondent: {
        trigger: "Respondent",
        prefix: "[Respondent:-",
        suffix: "]",
        inputs: [{ key: "respondent" }]
    },
    Court: {
        trigger: "Court",
        prefix: "[Court:-",
        suffix: "]",
        inputs: [{ key: "court" }]
    }
};

interface SearchEngineInputProps {
    placeholder?: string;
    className?: string;
    helperText?: string;
    scopes?: string[];
    courtCategories?: CourtCategory[];
    contextItems?: ContextItem[];
    folderOptions?: DropdownOption[];
    quickAddOptions?: OptionHelper[];
    triggers?: Record<string, TriggerConfig>;
    staticData?: StaticDataConfig;
    tokenConfig?: Record<string, TokenStructure>;
    onSubmit?: (payload: SearchPayload) => void;
    children?: React.ReactNode;
    onOptionClick?: (value: string, currentContent?: string) => boolean | void;
    selectedCourts?: string[];
    onCourtsChange?: (courts: string[]) => void;
    isLoading?: boolean;
    onStop?: () => void;
    isMobile?: boolean;
}

function SearchEngineInput({
    placeholder,
    helperText,
    scopes = [],
    courtCategories = [],
    contextItems = [],
    folderOptions = [],
    quickAddOptions = [],
    triggers = {},
    staticData = {},
    tokenConfig = DEFAULT_TOKEN_CONFIG,
    onSubmit,
    onOptionClick,
    selectedCourts: propSelectedCourts,
    onCourtsChange,
    isLoading = false,
    onStop,
    isMobile = false,
}: SearchEngineInputProps) {
    const TRIGGER_CONFIG = triggers;
    const [isCentered, setIsCentered] = useState(true);
    const [input, setInput] = useState("");
    const [selectedScopes, setSelectedScopes] = useState<string[]>(["Overall search"]);
    const [internalSelectedCourts, setInternalSelectedCourts] = useState<string[]>([]);

    const effectiveSelectedCourts = propSelectedCourts !== undefined ? propSelectedCourts : internalSelectedCourts;

    const handleCourtsChange = (newCourts: string[]) => {
        if (onCourtsChange) {
            onCourtsChange(newCourts);
        }
        if (propSelectedCourts === undefined) {
            setInternalSelectedCourts(newCourts);
        }
    };

    const [selectedContextItems, setSelectedContextItems] = useState<string[]>([]);
    const [contextMode, setContextMode] = useState<"auto" | "self-managed">("self-managed");
    const [activeDropdown, setActiveDropdown] = useState<
        "add" | "settings" | "folder" | "trigger" | null
    >(null);
    const textareaRef = useRef<HTMLDivElement>(null);

    const [activeTrigger, setActiveTrigger] = useState<TriggerType>(null);
    const [triggerStartIndex, setTriggerStartIndex] = useState<number | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeWrapperType, setActiveWrapperType] = useState<string | null>(null);
    const lastCursorOffset = useRef(0);
    const activeWrapperRef = useRef<HTMLSpanElement | null>(null);
    const lastKeyTime = useRef<number>(0);
    const KEY_THROTTLE_MS = 300;

    React.useEffect(() => {
        if (contextMode === "auto" && contextItems.length > 0 && selectedContextItems.length === 0) {
            setSelectedContextItems(contextItems.slice(0, 10).map((i) => i.id));
        }
    }, [contextItems, contextMode]);

    React.useEffect(() => {
        if (input.trim() === "") {
            setIsCentered(true);
        }
    }, [input]);

    React.useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;

            const currentWrapper = getWrapperNode(currentNode);
            const currentValueInput = getValueInputNode(currentNode);

            if (activeWrapperRef.current) {
                if (currentWrapper !== activeWrapperRef.current) {
                    const valueInputs = activeWrapperRef.current.querySelectorAll(".static-value-input");
                    let allEmpty = true;
                    valueInputs.forEach(input => {
                        if (input.textContent && input.textContent.trim() !== "") {
                            allEmpty = false;
                        }
                    });

                    if (allEmpty) {
                        const valueInput = valueInputs[0];
                        if (valueInput) {
                            const newRange = document.createRange();
                            newRange.selectNodeContents(valueInput);
                            newRange.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(newRange);
                            return;
                        }
                    } else {
                        activeWrapperRef.current = null;
                        setActiveWrapperType(null);
                        setActiveDropdown(null);
                    }
                }
            }

            if (currentWrapper && currentValueInput) {
                const type = currentWrapper.getAttribute("data-type");
                if (type !== activeWrapperType) setActiveWrapperType(type);

                if (!currentValueInput.textContent || currentValueInput.textContent.trim() === "") {
                    activeWrapperRef.current = currentWrapper;
                }
            } else {
                if (activeWrapperType) setActiveWrapperType(null);
            }
        };

        document.addEventListener("selectionchange", handleSelectionChange);
        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange);
        };
    }, [activeWrapperType]);

    const MAX_LINES = 8;
    const CENTER_HEIGHT = 78;
    const BOTTOM_HEIGHT = 48;

    const { refs, floatingStyles, context } = useFloating({
        placement: activeDropdown === "trigger" ? "top-start" : "bottom-start",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset({ mainAxis: 12 }),
            flip({
                fallbackPlacements:
                    activeDropdown === "trigger"
                        ? ["top-start", "top-end", "bottom-start", "bottom-end"]
                        : ["top-start", "top-end"],
            }),
            shift({ padding: 8 }),
        ],
        open: activeDropdown !== null,
        onOpenChange: (open: any) => {
            if (!open) {
                setActiveDropdown(null);
                setActiveIndex(null);
                if (activeDropdown === "trigger") {
                    setActiveTrigger(null);
                    setTriggerStartIndex(null);
                    setSearchQuery("");
                }
            }
        },
    });

    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

    const TRIGGER_VALUES = useMemo(() => {
        const values: Record<string, Set<string>> = {};
        Object.entries(triggers).forEach(([key, config]) => {
            values[key] = getAllValues(config.options);
        });
        return values;
    }, [triggers]);

    const triggerOptions = useMemo(() => {
        if (activeWrapperType) {

            if (staticData[activeWrapperType]) {
                return staticData[activeWrapperType];
            }

            return [];
        }

        if (activeTrigger && triggers[activeTrigger]) {
            return triggers[activeTrigger].options;
        }

        return [];
    }, [activeTrigger, activeWrapperType, triggers, staticData]);

    const filteredTriggerOptions = useMemo(() => {
        if (!triggerOptions) return [];
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
        const normalizedQuery = normalize(searchQuery);

        return triggerOptions.filter((opt: DropdownOption) => {
            const normalizedTitle = normalize(opt.title || "");
            const normalizedValue = normalize(opt.value || "");
            return normalizedTitle.includes(normalizedQuery) || normalizedValue.includes(normalizedQuery);
        });
    }, [triggerOptions, searchQuery]);

    const optionsRef = useRef(filteredTriggerOptions);
    const activeIndexRef = useRef(activeIndex);

    React.useEffect(() => {
        optionsRef.current = filteredTriggerOptions;
        activeIndexRef.current = activeIndex;
    }, [filteredTriggerOptions, activeIndex]);

    const autoResize = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";

        if (isCentered && textarea.scrollHeight <= CENTER_HEIGHT) {
            textarea.style.height = `${CENTER_HEIGHT}px`;
            textarea.style.overflowY = "hidden";
            return;
        }

        const LINE_HEIGHT = 24;
        const maxHeight = MAX_LINES * LINE_HEIGHT;
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        textarea.style.overflowY =
            textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [isCentered]);

    const getParsedPayload = useCallback(() => {
        const div = textareaRef.current;
        if (!div) return { query: "", filters: {} };

        const wrappers = div.querySelectorAll(".static-data-wrapper");
        const filters: any = {};
        const processedNodes = new Set<Node>();

        wrappers.forEach((wrapper) => {
            processedNodes.add(wrapper);
            const type = wrapper.getAttribute("data-type");
            const valInputs = wrapper.querySelectorAll(".static-value-input");
            if (!type || valInputs.length === 0) return;

            const config = tokenConfig[type] || DEFAULT_TOKEN_CONFIG[type];

            if (type === "Year") {
                const value = valInputs[0].textContent?.trim() || "";
                if (value.includes(":")) {
                    const [from, to] = value.split(":");
                    filters.year_range = { from: parseInt(from), to: parseInt(to) };
                } else if (value.includes(",")) {
                    filters.year = value.split(",").map(y => parseInt(y.trim()));
                } else {
                    filters.year = parseInt(value);
                }
                return;
            }

            if (type === "Act") {
                const name = valInputs[0]?.textContent?.trim() || "";
                const sec = valInputs[1]?.textContent?.trim();
                if (!filters.acts) filters.acts = [];
                filters.acts.push({ name: name, section: sec || null });
                return;
            }

            if (config && config.inputs.length === 1 && config.inputs[0].key) {
                const key = config.inputs[0].key;
                const val = valInputs[0].textContent?.trim();
                if (val) filters[key] = val;
            } else if (config) {
                config.inputs.forEach((inputConfig, idx) => {
                    if (inputConfig.key && valInputs[idx]) {
                        const val = valInputs[idx].textContent?.trim();
                        if (val) filters[inputConfig.key] = val;
                    }
                });
            }
        });

        let queryText = "";
        let displayQuery = "";

        div.childNodes.forEach(node => {
            if (processedNodes.has(node)) {
                // It is a wrapper, so we need to reconstruct its string form for displayQuery
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement;
                    const type = el.getAttribute("data-type");
                    if (type) {
                        const config = tokenConfig[type] || DEFAULT_TOKEN_CONFIG[type];
                        const valInputs = el.querySelectorAll(".static-value-input");

                        if (config) {
                            let tokenString = config.prefix;
                            config.inputs.forEach((inputConfig, idx) => {
                                if (idx > 0 && inputConfig.prefix) {
                                    tokenString += inputConfig.prefix;
                                }
                                if (valInputs[idx]) {
                                    tokenString += valInputs[idx].textContent || "";
                                }
                            });
                            tokenString += config.suffix;
                            displayQuery += tokenString;
                        } else {
                            // Fallback if no config (shouldn't happen for valid tokens)
                            displayQuery += el.textContent || "";
                        }
                    } else {
                        displayQuery += el.textContent || "";
                    }
                }
                return;
            }

            if (node.nodeType === Node.TEXT_NODE) {
                const txt = node.textContent || "";
                queryText += txt;
                displayQuery += txt;
            } else if (node.nodeType === Node.ELEMENT_NODE && !(node as Element).classList.contains("static-data-wrapper")) {
                const txt = node.textContent || "";
                queryText += txt;
                displayQuery += txt;
            }
        });

        filters.scopes = selectedScopes;
        filters.contextItems = selectedContextItems;
        filters.courts = effectiveSelectedCourts;

        return {
            query: queryText.replace(/\s+/g, " ").trim(),
            displayQuery: displayQuery.replace(/\s+/g, " ").trim(), // Add this
            filters
        };
    }, [selectedScopes, tokenConfig, selectedContextItems, effectiveSelectedCourts]);

    const handleSubmit = useCallback(() => {
        const payload = getParsedPayload();

        if (!payload.query.trim() && Object.keys(payload.filters).length === 0 || !textareaRef.current) return;

        if (onSubmit) {
            onSubmit(payload);
        }

        setIsCentered(false);
        setInput("");
        textareaRef.current.innerHTML = "";

        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = `${BOTTOM_HEIGHT}px`;
                textareaRef.current.style.overflowY = "hidden";
            }
        });
    }, [getParsedPayload, BOTTOM_HEIGHT, onSubmit]);

    const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        const currentNode = range.startContainer;

        lastCursorOffset.current = cursorPosition;

        const textBeforeCursor = currentNode.textContent || "";

        const wrapper = getWrapperNode(currentNode);
        if (wrapper) {
            const type = wrapper.getAttribute("data-type");
            const valInput = getValueInputNode(currentNode);

            if (type && valInput) {
                setSearchQuery(valInput.textContent || "");
                if (activeDropdown !== "trigger") {
                    setActiveDropdown("trigger");
                }
                (window as any).activeTriggerNode = currentNode;
            }
        } else {
            if (activeTrigger && triggerStartIndex !== null) {
                const potentialTriggerChar = textBeforeCursor[triggerStartIndex];
                if (potentialTriggerChar !== activeTrigger) {
                    setActiveTrigger(null);
                    setTriggerStartIndex(null);
                    setActiveDropdown(null);
                    return;
                }

                const currentQuery = textBeforeCursor.slice(triggerStartIndex + 1, cursorPosition);
                if (currentQuery.includes(" ")) {
                    setActiveTrigger(null);
                    setTriggerStartIndex(null);
                    setActiveDropdown(null);
                } else {
                    setSearchQuery(currentQuery);
                }
            }

            const lastChar = textBeforeCursor[cursorPosition - 1];
            if (TRIGGER_CONFIG[lastChar]) {
                setActiveTrigger(lastChar as TriggerType);
                setTriggerStartIndex(cursorPosition - 1);
                setSearchQuery("");
                setActiveDropdown("trigger");
                (window as any).activeTriggerNode = currentNode;
            }
        }

        setInput(e.currentTarget.innerText);
        requestAnimationFrame(autoResize);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (activeDropdown && (activeDropdown === "trigger" || activeDropdown === "add")) {
            const options = activeDropdown === "trigger" ? filteredTriggerOptions : quickAddOptions;

            if (options.length > 0) {

                const now = Date.now();
                const isArrowKey = e.key === "ArrowDown" || e.key === "ArrowUp";

                if (isArrowKey && e.repeat && now - lastKeyTime.current < KEY_THROTTLE_MS) {
                    e.preventDefault();
                    return;
                }

                if (isArrowKey) {
                    lastKeyTime.current = now;
                }

                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % options.length));
                    return;
                }
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev === null ? options.length - 1 : (prev - 1 + options.length) % options.length
                    );
                    return;
                }
                if (e.key === "Enter" && activeIndex !== null) {
                    e.preventDefault();
                    handleOptionSelect(options[activeIndex].value);
                    return;
                }
            }
        }

        if (e.key === "Enter" && !e.shiftKey && input.trim() !== "" && input.trim().split(/\s+/).length >= 3) {
            e.preventDefault();
            handleSubmit();
            return;
        }

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const valueInput = getValueInputNode(range.startContainer);

            if (valueInput) {
                const wrapper = getWrapperNode(valueInput);
                if (wrapper) {
                    const textContent = valueInput.textContent || "";


                    if (activeDropdown === "trigger" && filteredTriggerOptions.length > 0) {

                        const now = Date.now();
                        const isArrowKey = e.key === "ArrowDown" || e.key === "ArrowUp";

                        if (isArrowKey && e.repeat && now - lastKeyTime.current < KEY_THROTTLE_MS) {
                            e.preventDefault();
                            return;
                        }

                        if (isArrowKey) {
                            lastKeyTime.current = now;
                        }

                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredTriggerOptions.length));
                            return;
                        }
                        if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setActiveIndex((prev) =>
                                prev === null ? filteredTriggerOptions.length - 1 : (prev - 1 + filteredTriggerOptions.length) % filteredTriggerOptions.length
                            );
                            return;
                        }
                        if (e.key === "Enter" && activeIndex !== null) {
                            e.preventDefault();
                            handleOptionSelect(filteredTriggerOptions[activeIndex].value);
                            return;
                        }
                    }

                    if (textContent.trim() === "") {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            return;
                        }

                        if (e.key === "Backspace" && range.startOffset === 0) {
                            e.preventDefault();

                            const nextSibling = wrapper.nextSibling;
                            wrapper.remove();

                            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent === "\u00A0") {
                                nextSibling.remove();
                            }

                            setActiveDropdown(null);
                            setActiveWrapperType(null);
                            setActiveIndex(null);
                            setSearchQuery("");
                            activeWrapperRef.current = null;

                            setTimeout(() => {
                                if (textareaRef.current) {
                                    setInput(textareaRef.current.innerText);
                                    textareaRef.current.focus();

                                    const sel = window.getSelection();
                                    if (sel) {
                                        const newRange = document.createRange();
                                        newRange.selectNodeContents(textareaRef.current);
                                        newRange.collapse(false);
                                        sel.removeAllRanges();
                                        sel.addRange(newRange);
                                    }
                                }
                            }, 0);
                            return;
                        }
                    }
                }
            }
        }

        if (e.key === "Backspace") {
            const selection = window.getSelection();
            if (!selection || !selection.isCollapsed) return;

            const range = selection.getRangeAt(0);
            const startNode = range.startContainer;
            const startOffset = range.startOffset;

            if (startNode.nodeType === Node.TEXT_NODE) {
                if (startOffset === 0) {
                    const previousNode = startNode.previousSibling;
                    if (previousNode && previousNode.nodeType === Node.ELEMENT_NODE && ((previousNode as HTMLElement).classList.contains("static-data-wrapper") || (previousNode as HTMLElement).classList.contains("mention-badge"))) {
                        e.preventDefault();
                        previousNode.remove();
                        return;
                    }
                    if (previousNode && previousNode.nodeType === Node.TEXT_NODE && previousNode.textContent === "\u00A0") {
                        const badgeNode = previousNode.previousSibling;
                        if (badgeNode && badgeNode.nodeType === Node.ELEMENT_NODE && ((badgeNode as HTMLElement).classList.contains("static-data-wrapper") || (badgeNode as HTMLElement).classList.contains("mention-badge"))) {
                            e.preventDefault();
                            previousNode.remove();
                            badgeNode.remove();
                            return;
                        }
                    }
                } else if (startOffset === 1 && startNode.textContent?.charAt(0) === "\u00A0") {
                    const previousNode = startNode.previousSibling;
                    if (previousNode && previousNode.nodeType === Node.ELEMENT_NODE && ((previousNode as HTMLElement).classList.contains("static-data-wrapper") || (previousNode as HTMLElement).classList.contains("mention-badge"))) {
                        e.preventDefault();
                        previousNode.remove();

                        if (startNode.textContent.length === 1) {
                            startNode.textContent = "";
                        } else {
                            startNode.textContent = startNode.textContent.substring(1);
                        }
                        return;
                    }
                }
            } else if (startNode.nodeType === Node.ELEMENT_NODE) {
                if (startOffset > 0) {
                    const previousNode = startNode.childNodes[startOffset - 1];
                    if (previousNode) {
                        if (previousNode.nodeType === Node.ELEMENT_NODE && ((previousNode as HTMLElement).classList.contains("static-data-wrapper") || (previousNode as HTMLElement).classList.contains("mention-badge"))) {
                            e.preventDefault();
                            previousNode.remove();
                            return;
                        }
                        if (previousNode.nodeType === Node.TEXT_NODE && previousNode.textContent === "\u00A0") {
                            const badgeNode = previousNode.previousSibling;
                            if (badgeNode && badgeNode.nodeType === Node.ELEMENT_NODE && ((badgeNode as HTMLElement).classList.contains("static-data-wrapper") || (badgeNode as HTMLElement).classList.contains("mention-badge"))) {
                                e.preventDefault();
                                previousNode.remove();
                                badgeNode.remove();
                                return;
                            }
                        }
                    }
                }
            }

            const cursorPosition = getCursorOffset(e.currentTarget);


            const textBefore = input.slice(0, cursorPosition);
            const lookBackLimit = 50;
            const startSearch = Math.max(0, textBefore.length - lookBackLimit);

            let triggerChar: TriggerType = null;
            let triggerIndex = -1;

            for (let i = textBefore.length - 1; i >= startSearch; i--) {
                const char = textBefore[i];
                if (TRIGGER_CONFIG[char]) {
                    triggerChar = char as TriggerType;
                    triggerIndex = i;
                    break;
                }
            }

            if (triggerChar && triggerIndex !== -1) {
                const tokenText = textBefore.slice(triggerIndex);
                const tokenValue = tokenText.slice(1).trimEnd();

                if (TRIGGER_VALUES[triggerChar]?.has(tokenValue)) {
                    e.preventDefault();
                    const newInput =
                        input.slice(0, triggerIndex) + input.slice(cursorPosition);
                    setInput(newInput);

                    requestAnimationFrame(() => {
                        if (textareaRef.current) {
                            setCursorOffset(textareaRef.current, triggerIndex);
                            autoResize();
                        }
                    });
                }
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
    };

    const handleOptionSelect = (option: string, isManual: boolean = false) => {
        if (onOptionClick) {
            const currentPayload = getParsedPayload();
            const currentQuery = currentPayload.query || "";

            const handled = onOptionClick(option, currentQuery);
            if (handled) {
                setActiveDropdown(null);
                setTriggerStartIndex(null);
                setSearchQuery("");
                setActiveIndex(null);
                return;
            }
        }
        const div = textareaRef.current;

        const selection = window.getSelection();
        if (!selection) return;

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const node = range.startContainer;
            const wrapper = getWrapperNode(node);
            const valInput = getValueInputNode(node);

            if (wrapper && valInput) {
                const isStaticType = Object.keys(tokenConfig).includes(option) || option.startsWith("Court:");

                if (!isStaticType) {
                    valInput.textContent = option;

                    const space = document.createTextNode("\u00A0");
                    wrapper.after(space);

                    setActiveTrigger(null);
                    setTriggerStartIndex(null);
                    setActiveDropdown(null);
                    activeWrapperRef.current = null;
                    setActiveWrapperType(null);
                    setActiveIndex(null);

                    requestAnimationFrame(() => {
                        if (div) {
                            div.focus();
                            const exitRange = document.createRange();
                            exitRange.setStartAfter(space);
                            exitRange.collapse(true);
                            const sel = window.getSelection();
                            if (sel) {
                                sel.removeAllRanges();
                                sel.addRange(exitRange);
                            }
                            setInput(div.innerText);
                        }
                    });

                    return;
                }
            }
        }

        const targetNode = (window as any).activeTriggerNode;


        const isStaticType = Object.keys(tokenConfig).includes(option) || option.startsWith("Court:");
        const isTriggerOption = activeTrigger === "@" || activeTrigger === "/";


        const range = document.createRange();

        if (!isManual && targetNode && activeTrigger && triggerStartIndex !== null) {

            range.setStart(targetNode, triggerStartIndex);
            range.setEnd(targetNode, lastCursorOffset.current);
            range.deleteContents();
        } else if (div) {

            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const selRange = sel.getRangeAt(0);
                if (div.contains(selRange.startContainer)) {
                    range.setStart(selRange.startContainer, selRange.startOffset);
                    range.collapse(true);
                } else {
                    range.selectNodeContents(div);
                    range.collapse(false);
                }
            } else {
                range.selectNodeContents(div);
                range.collapse(false);
            }
        } else if (!isStaticType) {

            return;
        }


        if (isStaticType || activeTrigger === "[") {
            let currentWrapper: HTMLElement | null = null;
            if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
                const el = range.startContainer as HTMLElement;
                if (el.classList.contains("static-data-wrapper")) {
                    currentWrapper = el;
                } else {
                    currentWrapper = el.closest(".static-data-wrapper");
                }
            } else if (range.startContainer.parentNode) {
                currentWrapper = (range.startContainer.parentNode as HTMLElement).closest(".static-data-wrapper");
            }

            if (currentWrapper) {
                const inputs = currentWrapper.querySelectorAll(".static-value-input");
                let isEmpty = true;
                inputs.forEach((inp) => {
                    if (inp.textContent && inp.textContent.trim() !== "") isEmpty = false;
                });

                if (isEmpty) {
                    range.setStartBefore(currentWrapper);
                    range.collapse(true);
                    currentWrapper.remove();
                } else {
                    range.setStartAfter(currentWrapper);
                    range.collapse(true);
                }
            }

            const wrapper = document.createElement("span");
            wrapper.className = "static-data-wrapper";
            wrapper.style.color = "var(--color-color-text-primary-default)";
            wrapper.style.fontWeight = "400";
            wrapper.contentEditable = "false";

            let typeKey = option;
            let prefilledValue = "";

            if (option.startsWith("Court:")) {
                prefilledValue = option.substring(6);
                typeKey = "Court";
            }

            const config = tokenConfig[typeKey] || DEFAULT_TOKEN_CONFIG[typeKey];

            if (config) {
                wrapper.setAttribute("data-type", typeKey);

                const prefix = document.createElement("span");
                prefix.textContent = config.prefix;
                wrapper.appendChild(prefix);

                config.inputs.forEach((inputConfig, idx) => {
                    if (idx > 0 && inputConfig.prefix) {
                        const separator = document.createElement("span");
                        separator.textContent = inputConfig.prefix;
                        separator.contentEditable = "false";
                        separator.style.color = "var(--color-color-text-primary-default)";
                        wrapper.appendChild(separator);
                    }

                    const inputSpan = document.createElement("span");
                    inputSpan.className = "static-value-input";
                    inputSpan.contentEditable = "true";
                    inputSpan.style.outline = "none";
                    inputSpan.style.minWidth = "10px";
                    inputSpan.style.display = "inline-block";

                    if (idx === 0 && prefilledValue) {
                        inputSpan.textContent = prefilledValue;
                    }

                    wrapper.appendChild(inputSpan);
                });

                const suffix = document.createElement("span");
                suffix.textContent = config.suffix;
                wrapper.appendChild(suffix);

                range.insertNode(wrapper);


                const inputs = wrapper.querySelectorAll(".static-value-input");
                if (inputs.length > 0) {
                    const firstInput = inputs[0] as HTMLElement;

                    setTimeout(() => {
                        firstInput.focus();
                        const sel = window.getSelection();
                        if (sel) {
                            const cursorRange = document.createRange();
                            cursorRange.selectNodeContents(firstInput);
                            cursorRange.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(cursorRange);
                        }
                    }, 10);


                    if (inputs.length > 1) {
                        (inputs[1] as HTMLElement).onfocus = () => {
                            if (!inputs[0].textContent || inputs[0].textContent.trim() === "") {
                                (inputs[0] as HTMLElement).focus();
                            }
                        };
                    }
                }
            }
        } else if (isTriggerOption && activeTrigger) {

            const badge = document.createElement("span");
            badge.className = "mention-badge";
            badge.setAttribute("data-type", activeTrigger);
            badge.setAttribute("data-value", option);
            badge.style.color = "var(--color-color-text-primary-default)";
            badge.contentEditable = "false";
            badge.textContent = option.startsWith(activeTrigger) ? option : `${activeTrigger}${option}`;

            range.insertNode(badge);
            const space = document.createTextNode("\u00A0");
            badge.after(space);

            const newRange = document.createRange();
            newRange.setStartAfter(space);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }

        if (["Case", "Judge", "Appellant", "Respondent"].includes(option)) {
            setActiveTrigger(null);
            setTriggerStartIndex(null);
            setActiveDropdown("trigger");
            setActiveWrapperType(option);
            setSearchQuery("");
            setActiveIndex(null);
        } else {
            setActiveTrigger(null);
            setTriggerStartIndex(null);
            setActiveDropdown(null);
            setSearchQuery("");
        }
        if (div) setInput(div.innerText);
    };

    const toggleDropdown = (dropdown: "add" | "settings" | "folder") => {
        setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    const renderTriggerDropdown = () => {
        if (activeDropdown !== "trigger") return null;
        if (!activeTrigger && !activeWrapperType) return null;

        const dropdownWrapperTypes = ["Case", "Judge", "Appellant", "Respondent"];
        if (activeWrapperType && !dropdownWrapperTypes.includes(activeWrapperType)) return null;

        const config = activeTrigger ? TRIGGER_CONFIG[activeTrigger] : { renderType: "flat" };
        const options = filteredTriggerOptions;
        return createPortal(
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-[9999]"
            >
                <div className="animate-dropdown-enter">
                    {config.renderType === "nested" ? (
                        <NestedDropdown
                            options={options}
                            value={null}
                            onChange={handleOptionSelect}
                            activeIndex={activeIndex}
                        />
                    ) : (
                        <Dropdown
                            options={options as DropdownOption[]}
                            value={null}
                            onChange={handleOptionSelect}
                            searchbar="off"
                            placeholder="Select an option"
                            activeIndex={activeIndex}
                        />
                    )}
                </div>
            </div>,
            document.body
        );
    };

    const renderButtonDropdown = () => {
        if (activeDropdown === "trigger" || !activeDropdown) return null;
        if (activeDropdown !== "add" && activeDropdown !== "settings" && activeDropdown !== "folder") return null;

        return createPortal(
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-[9999]"
            >
                <div className="animate-dropdown-enter">
                    {activeDropdown === "add" ? (
                        <NestedDropdown
                            options={quickAddOptions}
                            value={null}
                            onChange={(value) => {
                                console.log("Selected from button dropdown:", value);
                                handleOptionSelect(value, true);

                                if (!["Case", "Judge", "Appellant", "Respondent"].includes(value)) {
                                    setActiveDropdown(null);
                                }
                                setActiveIndex(null);
                            }}
                            activeIndex={activeIndex}
                            customComponents={{
                                // Removed add_context legacy component
                            }}
                        />
                    ) : activeDropdown === "settings" ? (
                        <SearchScopeSelector
                            availableScopes={scopes}
                            selectedScopes={selectedScopes}
                            onScopeSelect={(scope) => {
                                if (!selectedScopes.includes(scope)) {
                                    setSelectedScopes([...selectedScopes, scope]);
                                }
                            }}
                            onScopeRemove={(scope) => {
                                setSelectedScopes(selectedScopes.filter((s) => s !== scope));
                            }}
                        />
                    ) : (
                        <div className="w-[350px]">
                            <CourtSelector
                                categories={courtCategories}
                                selectedCourts={effectiveSelectedCourts}
                                onCourtSelect={(court) => {
                                    const newCourts = [...effectiveSelectedCourts, court];
                                    handleCourtsChange(newCourts);
                                }}
                                onCourtDeselect={(court) => {
                                    const newCourts = effectiveSelectedCourts.filter((c) => c !== court);
                                    handleCourtsChange(newCourts);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div
            className={cn(
                'flex flex-col w-full transition-all items-center',
                isCentered ? 'h-fit justify-center' : 'h-full justify-end'
            )}
        >
            <div className="relative w-full flex flex-col items-center min-h-fit">

                {helperText && (
                    <div
                        className="absolute w-full h-full z-0 rounded-t-2xl px-4 py-2 text-sm bg-color-surface-primary-subtle_bg"
                        style={{ bottom: 34 }}
                    >
                        <span>{helperText}</span>
                    </div>
                )}
                <div className="relative w-full z-10 border border-gray-300 rounded-2xl px-6 py-4 mb-4 flex flex-col gap-3 items-center justify-around bg-white">
                    <div
                        contentEditable={true}
                        ref={(node) => {
                            textareaRef.current = node;
                            if (activeDropdown === "trigger") refs.setReference(node);
                        }}
                        {...getReferenceProps()}
                        data-placeholder="Ask anything. Type @ for mentions, / for commands."
                        className="content-editable w-full resize-none focus:outline-none leading-6 transition-[height] duration-150 ease-out"
                        style={{ height: isCentered ? CENTER_HEIGHT : BOTTOM_HEIGHT }}
                        onInput={handleTextChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                    />

                    <div className="w-full flex items-center justify-between flex-wrap gap-y-2">
                        <div className="flex gap-2">
                            <IconButton
                                onClick={() => toggleDropdown("add")}
                                ref={(node) => {
                                    if (activeDropdown === "add") refs.setReference(node);
                                }}
                                color="neutral"
                                icon="add"
                                size="medium"
                                boundary="stroked"
                                corner="sharp"
                                className={`hover:bg-color-surface-primary-subtle_bg hover:border-color-surface-primary-subtle_bg ${activeDropdown === "add" ? "bg-color-surface-primary-subtle_bg border-color-surface-primary-subtle_bg" : ""
                                    }`}
                            />
                            <IconButton
                                onClick={() => toggleDropdown("settings")}
                                ref={(node) => {
                                    if (activeDropdown === "settings") refs.setReference(node);
                                }}
                                color="neutral"
                                icon="setting-c"
                                size="medium"
                                boundary="stroked"
                                corner="sharp"
                                className={`hover:bg-color-surface-primary-subtle_bg hover:border-color-surface-primary-subtle_bg ${activeDropdown === "settings" ? "bg-color-surface-primary-subtle_bg border-color-surface-primary-subtle_bg" : ""
                                    }`}
                            />
                            <IconButton
                                onClick={() => toggleDropdown("folder")}
                                ref={(node) => {
                                    if (activeDropdown === "folder") refs.setReference(node);
                                }}
                                color="neutral"
                                icon="folder-open"
                                size="medium"
                                boundary="stroked"
                                corner="sharp"
                                className={`hover:bg-color-surface-primary-subtle_bg hover:border-color-surface-primary-subtle_bg ${activeDropdown === "folder" ? "bg-color-surface-primary-subtle_bg border-color-surface-primary-subtle_bg" : ""
                                    }`}
                            />
                        </div>
                        <div className="flex gap-2 items-center ml-auto sm:ml-0">
                            {input.trim().length > 0 && !["/", "@", "["].some(char => input.trim().startsWith(char)) && (
                                <Button
                                    size="small"
                                    className="text-color-text-primary-default bg-color-surface-neutral-default border border-color-surface-primary-default whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Enhance Query</span>
                                    <span className="sm:hidden">Enhance</span>
                                </Button>
                            )}
                            <IconButton
                                onClick={isLoading ? onStop : handleSubmit}
                                color={isLoading ? "neutral" : "primary"}
                                icon={isLoading ? "stop" : "arrow-up-d"}
                                size="medium"
                                corner="sharp"
                                disabled={!isLoading && (!input.trim() || input.trim().split(/\s+/).length < 3)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {renderTriggerDropdown()}
            {renderButtonDropdown()}
        </div>
    );
}

function getWrapperNode(node: Node | null): HTMLSpanElement | null {
    if (!node) return null;
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains("static-data-wrapper")) {
        return node as HTMLSpanElement;
    }
    return getWrapperNode(node.parentNode);
}

function getValueInputNode(node: Node | null): HTMLSpanElement | null {
    if (!node) return null;
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains("static-value-input")) {
        return node as HTMLSpanElement;
    }
    return getValueInputNode(node.parentNode);
}

export default React.memo(SearchEngineInput);


function getCursorOffset(element: HTMLElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
}

function setCursorOffset(element: HTMLElement, offset: number) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    let charCount = 0;

    function traverseNodes(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nextCharCount = charCount + (node.textContent?.length || 0);
            if (offset >= charCount && offset <= nextCharCount) {
                range.setStart(node, offset - charCount);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
                return true;
            }
            charCount = nextCharCount;
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                if (traverseNodes(node.childNodes[i])) return true;
            }
        }
        return false;
    }

    traverseNodes(element);
}