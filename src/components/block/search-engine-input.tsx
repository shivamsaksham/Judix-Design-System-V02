"use client";
import React, { useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { IconButton, Dropdown, DropdownOption } from "@/components/ui";
import { Icon } from "@judix/icon";
import {
    useFloating,
    offset,
    flip,
    shift,
    useDismiss,
    useInteractions,
    autoUpdate,
} from "@floating-ui/react";
import { ModelDropdown } from "./model-dropdown";
import { createPortal } from "react-dom";
import NestedDropdown from "./custom-dropdown-helper";
import { SearchScopeSelector } from "./search-scope-selector";
import { ContextItem } from "./context-window";
import { CourtSelector, CourtCategory } from "./court-selector";
import { ProjectChoiceDropdown, ProjectChoiceItem } from "./project-choice-dropdown";
import { MentionDropdown } from "./mention-dropdown";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddToContext from "./context-add-modal";
import { Option } from "@/components/ui/option";

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
    filters: Record<string, unknown>;
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
        inputs: [{ key: "year" }],
    },
    Case: {
        trigger: "Case",
        prefix: "[Case:-",
        suffix: "]",
        inputs: [{ placeholder: "select", key: "case_type" }],
    },
    Judge: {
        trigger: "Judge",
        prefix: "[Judge:-",
        suffix: "]",
        inputs: [{ placeholder: "select", key: "judge" }],
    },
    Bench: {
        trigger: "Bench",
        prefix: "[Bench:-",
        suffix: "]",
        inputs: [{ key: "bench" }],
    },
    Act: {
        trigger: "Act",
        // Act name comes from dropdown; section is typed freely only after user accepts the chip
        prefix: "[Act:-",
        suffix: "]",
        inputs: [
            { placeholder: "select", key: "act_name" },
            { prefix: " ; Sections-", placeholder: "section", key: "section" },
        ],
    },
    SCR: {
        trigger: "SCR",
        prefix: "[SCR:-",
        suffix: "]",
        inputs: [{ placeholder: "year volume SCR page", key: "scr_citation" }],
    },
    INSC: {
        trigger: "INSC",
        prefix: "[INSC:-",
        suffix: "]",
        inputs: [{ placeholder: "year INSC number", key: "insc_citation" }],
    },
    Appellant: {
        trigger: "Appellant",
        prefix: "[Appellant:-",
        suffix: "]",
        inputs: [{ key: "appellant" }],
    },
    Respondent: {
        trigger: "Respondent",
        prefix: "[Respondent:-",
        suffix: "]",
        inputs: [{ key: "respondent" }],
    },
    Court: {
        trigger: "Court",
        prefix: "[Court:-",
        suffix: "]",
        inputs: [{ key: "court" }],
    },
};

export interface PredictiveSuggestion {
    minChars?: number;
    prefixes: string[];
    tokenKey: string;
    option: string;
    colorScheme?: "primary" | "neutral";
}

export const PREDICTIVE_SUGGESTIONS: PredictiveSuggestion[] = [
    { prefixes: ["jud"], tokenKey: "Judge", option: "Judge", colorScheme: "neutral" },
    { prefixes: ["cas"], tokenKey: "Case", option: "Case", colorScheme: "neutral" },
    { prefixes: ["app"], tokenKey: "Appellant", option: "Appellant", colorScheme: "neutral" },
    { prefixes: ["res"], tokenKey: "Respondent", option: "Respondent", colorScheme: "neutral" },
    { prefixes: ["yea"], tokenKey: "Year", option: "Year", colorScheme: "neutral" },
    { prefixes: ["ben"], tokenKey: "Bench", option: "Bench", colorScheme: "neutral" },
    { prefixes: ["act"], tokenKey: "Act", option: "Act", colorScheme: "neutral" },
    { prefixes: ["cou"], tokenKey: "Court", option: "Court", colorScheme: "neutral" },
    { prefixes: ["scr"], tokenKey: "SCR", option: "SCR", colorScheme: "neutral" },
    { prefixes: ["ins"], tokenKey: "INSC", option: "INSC", colorScheme: "neutral" },
];

export function matchPrediction(
    lastWord: string,
    suggestions: PredictiveSuggestion[]
): PredictiveSuggestion | null {
    if (!lastWord) return null;
    return (
        suggestions.find(
            (s) =>
                lastWord.length >= (s.minChars ?? 3) &&
                s.prefixes.some((p) => lastWord.toLowerCase().startsWith(p.toLowerCase()))
        ) ?? null
    );
}

// Token types whose primary value is ALWAYS chosen from a dropdown.
// Typing in the contentEditable is blocked while their picker is open;
// keystrokes are forwarded to the portal search input instead.
const DROPDOWN_PICKER_TYPES = ["Case", "Judge", "Appellant", "Respondent", "Act"];

// Describes the "Enter Section" floating chip shown after an Act name is chosen
interface SectionChipState {
    wrapperEl: HTMLElement;
    x: number;
    y: number;
}

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
    projectLabel?: string;
    onProjectClick?: () => void;
    modelName?: string;
    projects?: ProjectChoiceItem[];
}

function SearchEngineInput({
    helperText,
    scopes = [],
    courtCategories = [],
    contextItems = [],
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
    projectLabel = "Choose project",
    onProjectClick,
    modelName: propModelName = "Judix Default",
    projects = [],
}: SearchEngineInputProps) {
    const TRIGGER_CONFIG = triggers;

    const [isCentered, setIsCentered] = useState(true);
    const [input, setInput] = useState("");
    const [selectedScopes, setSelectedScopes] = useState<string[]>(["Overall search"]);
    const [internalSelectedCourts, setInternalSelectedCourts] = useState<string[]>([]);
    const [isContextDialogOpen, setIsContextDialogOpen] = useState(false);
    const [modelName, setModelName] = useState(propModelName);

    const effectiveSelectedCourts =
        propSelectedCourts !== undefined ? propSelectedCourts : internalSelectedCourts;

    const handleCourtsChange = (newCourts: string[]) => {
        if (onCourtsChange) onCourtsChange(newCourts);
        if (propSelectedCourts === undefined) setInternalSelectedCourts(newCourts);
    };

    const [selectedContextItems, setSelectedContextItems] = useState<string[]>([]);
    const [contextMode] = useState<"auto" | "self-managed">("self-managed");
    const [activeDropdown, setActiveDropdown] = useState<
        "add" | "settings" | "folder" | "project" | "trigger" | null
    >(null);

    const textareaRef = useRef<HTMLDivElement>(null);

    // Stable refs for each anchor button so floating-ui always has the correct
    // reference element when a dropdown opens, regardless of render timing.
    const folderBtnRef = useRef<HTMLButtonElement>(null);
    const settingsBtnRef = useRef<HTMLButtonElement>(null);
    const projectBtnRef = useRef<HTMLButtonElement>(null);
    const [activeTrigger, setActiveTrigger] = useState<TriggerType>(null);
    const [triggerStartIndex, setTriggerStartIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeWrapperType, setActiveWrapperType] = useState<string | null>(null);

    const lastCursorOffset = useRef(0);
    const activeWrapperRef = useRef<HTMLSpanElement | null>(null);
    const lastKeyTime = useRef<number>(0);
    const KEY_THROTTLE_MS = 300;
    const triggerNodeRef = useRef<{ node: Node; offset: number } | null>(null);

    const [predictiveMatch, setPredictiveMatch] = useState<
        (PredictiveSuggestion & { typedWord: string; startOffset: number }) | null
    >(null);

    const [sectionChip, setSectionChip] = useState<SectionChipState | null>(null);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const suggestionAnchorRef = useRef<HTMLSpanElement | null>(null);
    const handleOptionSelectRef = useRef<((option: string) => void) | null>(null);
    const savedRangeRef = useRef<Range | null>(null);

    React.useEffect(() => {
        if (contextMode === "auto" && contextItems.length > 0 && selectedContextItems.length === 0) {
            setSelectedContextItems(contextItems.slice(0, 10).map((i) => i.id));
        }
    }, [contextItems, contextMode, selectedContextItems.length]);

    React.useEffect(() => {
        if (activeWrapperType) setPredictiveMatch(null);
    }, [activeWrapperType]);

    React.useEffect(() => {
        if (input.trim() === "") setIsCentered(true);
    }, [input]);

    // Track cursor and keep activeWrapperType in sync with caret position
    React.useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;

            if (!textareaRef.current?.contains(currentNode as Node)) return;

            const currentWrapper = getWrapperNode(currentNode);
            const currentValueInput = getValueInputNode(currentNode);

            if (activeWrapperRef.current && currentWrapper !== activeWrapperRef.current) {
                const valueInputs = activeWrapperRef.current.querySelectorAll(".static-value-input");
                const allEmpty = Array.from(valueInputs).every(
                    (inp) => !inp.textContent || inp.textContent.trim() === ""
                );

                if (allEmpty) {
                    const firstInput = valueInputs[0] as HTMLElement | undefined;
                    if (firstInput) {
                        const newRange = document.createRange();
                        newRange.selectNodeContents(firstInput);
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
        return () => document.removeEventListener("selectionchange", handleSelectionChange);
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
        onOpenChange: (open: boolean) => {
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

    // Update the floating anchor whenever activeDropdown changes.
    // Using a stable ref per button avoids the race where the conditional
    // ref callback in JSX has not yet fired when floatingStyles is first computed.
    React.useEffect(() => {
        if (activeDropdown === "folder") refs.setReference(folderBtnRef.current);
        else if (activeDropdown === "settings") refs.setReference(settingsBtnRef.current);
        else if (activeDropdown === "project") refs.setReference(projectBtnRef.current);
        else if (activeDropdown === "trigger") refs.setReference(textareaRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDropdown]);

    const TRIGGER_VALUES = useMemo(() => {
        const values: Record<string, Set<string>> = {};
        Object.entries(triggers).forEach(([key, config]) => {
            values[key] = getAllValues(config.options);
        });
        return values;
    }, [triggers]);

    const triggerOptions = useMemo(() => {
        if (activeWrapperType) return staticData[activeWrapperType] ?? [];
        if (activeTrigger && triggers[activeTrigger]) return triggers[activeTrigger].options;
        return [];
    }, [activeTrigger, activeWrapperType, triggers, staticData]);

    const filteredTriggerOptions = useMemo(() => {
        if (!triggerOptions) return [];
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
        const q = normalize(searchQuery);
        return triggerOptions.filter(
            (opt: DropdownOption) =>
                normalize(opt.title || "").includes(q) || normalize(opt.value || "").includes(q)
        );
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
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [isCentered]);

    const getParsedPayload = useCallback(() => {
        const div = textareaRef.current;
        if (!div) return { query: "", filters: {} };

        const wrappers = div.querySelectorAll(".static-data-wrapper");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    filters.year = value.split(",").map((y) => y.trim()).filter(Boolean).map(Number);
                } else if (value) {
                    filters.year = parseInt(value);
                }
                return;
            }

            if (type === "Bench") {
                const value = valInputs[0].textContent?.trim() || "";
                if (value) {
                    filters.bench = value.includes(",")
                        ? value.split(",").map((b) => b.trim()).filter(Boolean)
                        : value;
                }
                return;
            }

            if (type === "Act") {
                const name = valInputs[0]?.textContent?.trim() || "";
                const sec = valInputs[1]?.textContent?.trim();
                if (!filters.acts) filters.acts = [];
                filters.acts.push({ name, section: sec || null });
                return;
            }

            if (config && config.inputs.length === 1 && config.inputs[0].key) {
                const val = valInputs[0].textContent?.trim();
                if (val) filters[config.inputs[0].key!] = val;
            } else if (config) {
                config.inputs.forEach((inp, idx) => {
                    if (inp.key && valInputs[idx]) {
                        const val = valInputs[idx].textContent?.trim();
                        if (val) filters[inp.key] = val;
                    }
                });
            }
        });

        let queryText = "";
        let displayQuery = "";

        div.childNodes.forEach((node) => {
            if (processedNodes.has(node)) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement;
                    const type = el.getAttribute("data-type");
                    if (type) {
                        const config = tokenConfig[type] || DEFAULT_TOKEN_CONFIG[type];
                        const valInputs = el.querySelectorAll(".static-value-input");
                        if (config) {
                            let tokenString = config.prefix;
                            config.inputs.forEach((inputConfig, idx) => {
                                if (idx > 0 && inputConfig.prefix) tokenString += inputConfig.prefix;
                                if (valInputs[idx]) tokenString += valInputs[idx].textContent || "";
                            });
                            tokenString += config.suffix;
                            displayQuery += tokenString;
                        } else {
                            displayQuery += el.textContent || "";
                        }
                    } else {
                        displayQuery += el.textContent || "";
                    }
                }
                return;
            }
            if (node.nodeType === Node.TEXT_NODE) {
                queryText += node.textContent || "";
                displayQuery += node.textContent || "";
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                !(node as Element).classList.contains("static-data-wrapper")
            ) {
                queryText += node.textContent || "";
                displayQuery += node.textContent || "";
            }
        });

        filters.scopes = selectedScopes;
        filters.contextItems = selectedContextItems;
        filters.courts = effectiveSelectedCourts;

        return {
            query: queryText.replace(/\s+/g, " ").trim(),
            displayQuery: displayQuery.replace(/\s+/g, " ").trim(),
            filters,
        };
    }, [selectedScopes, tokenConfig, selectedContextItems, effectiveSelectedCourts]);

    const handleSubmit = useCallback(() => {
        const payload = getParsedPayload();
        if ((!payload.query.trim() && Object.keys(payload.filters).length === 0) || !textareaRef.current)
            return;

        if (onSubmit) onSubmit(payload);

        setIsCentered(false);
        setInput("");
        setSectionChip(null);
        textareaRef.current.innerHTML = "";

        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = `${BOTTOM_HEIGHT}px`;
                textareaRef.current.style.overflowY = "hidden";
            }
        });
    }, [getParsedPayload, BOTTOM_HEIGHT, onSubmit]);

    // Positions the "Enter Section" chip just below the Act wrapper
    const showSectionChip = (wrapperEl: HTMLElement) => {
        const rect = wrapperEl.getBoundingClientRect();
        setSectionChip({ wrapperEl, x: rect.left, y: rect.bottom + 8 });
    };

    // User accepted the chip: reveal the separator + section input, then focus it
    const activateSectionInput = (wrapperEl: HTMLElement) => {
        setSectionChip(null);

        // Show the " ; Sections-" separator text
        const separator = wrapperEl.querySelector(".static-section-separator") as HTMLElement | null;
        if (separator) separator.style.display = "inline";

        const inputs = wrapperEl.querySelectorAll(".static-value-input");
        const sectionInput = inputs[1] as HTMLElement | undefined;
        if (!sectionInput) return;

        sectionInput.contentEditable = "true";
        sectionInput.style.display = "inline-block";

        setTimeout(() => {
            sectionInput.focus();
            const sel = window.getSelection();
            if (sel) {
                const r = document.createRange();
                r.selectNodeContents(sectionInput);
                r.collapse(true);
                sel.removeAllRanges();
                sel.addRange(r);
            }
        }, 10);
    };

    // User skipped the chip: dismiss it without showing section
    const skipSectionInput = (wrapperEl: HTMLElement) => {
        setSectionChip(null);
        const space = document.createTextNode("\u00A0");
        wrapperEl.after(space);
        activeWrapperRef.current = null;
        setActiveWrapperType(null);

        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const sel = window.getSelection();
                if (sel) {
                    const r = document.createRange();
                    r.setStartAfter(space);
                    r.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(r);
                }
            }
        });
    };

    const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        savedRangeRef.current = range.cloneRange();

        const cursorOffset = range.startOffset;
        const currentNode = range.startContainer;
        lastCursorOffset.current = cursorOffset;

        const textBeforeCursor = currentNode.textContent || "";
        const wrapper = getWrapperNode(currentNode);

        if (wrapper) {
            const type = wrapper.getAttribute("data-type");
            const valInput = getValueInputNode(currentNode);

            if (type && valInput) {
                const rawText = valInput.textContent || "";

                // Secondary inputs (section, etc.) are pure free-text — no dropdown
                const allInputs = wrapper.querySelectorAll(".static-value-input");
                const inputIndex = Array.from(allInputs).indexOf(valInput);
                if (inputIndex > 0) {
                    setInput(e.currentTarget.innerText);
                    requestAnimationFrame(autoResize);
                    return;
                }

                // Comma re-opens the picker dropdown for multi-select types.
                // For Act: hide any visible section chip, clear the first input,
                // and re-open the Act dropdown so the user can pick another act.
                if (rawText.endsWith(",") && DROPDOWN_PICKER_TYPES.includes(type)) {
                    if (type === "Act") {
                        // Hide section chip and collapse section input back to hidden
                        setSectionChip(null);
                        const allWrapperInputs = wrapper.querySelectorAll(".static-value-input");
                        const sectionInput = allWrapperInputs[1] as HTMLElement | undefined;
                        const separator = wrapper.querySelector(".static-section-separator") as HTMLElement | null;
                        if (sectionInput) {
                            sectionInput.contentEditable = "false";
                            sectionInput.style.display = "none";
                            sectionInput.textContent = "";
                        }
                        if (separator) separator.style.display = "none";
                    }
                    setSearchQuery("");
                    setActiveDropdown("trigger");
                    setActiveWrapperType(type);
                    activeWrapperRef.current = wrapper as HTMLElement;
                    triggerNodeRef.current = null;
                    setTimeout(() => searchInputRef.current?.focus(), 20);
                    return;
                }

                setSearchQuery(rawText);
                if (activeDropdown !== "trigger") setActiveDropdown("trigger");
                triggerNodeRef.current = null;
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
                const currentQuery = textBeforeCursor.slice(triggerStartIndex + 1, cursorOffset);
                if (currentQuery.includes(" ")) {
                    setActiveTrigger(null);
                    setTriggerStartIndex(null);
                    setActiveDropdown(null);
                } else {
                    setSearchQuery(currentQuery);
                }
            }

            const lastChar = textBeforeCursor[cursorOffset - 1];
            if (TRIGGER_CONFIG[lastChar]) {
                setActiveTrigger(lastChar as TriggerType);
                setTriggerStartIndex(cursorOffset - 1);
                setSearchQuery("");
                setActiveDropdown("trigger");
                triggerNodeRef.current = { node: currentNode, offset: cursorOffset - 1 };
            }
        }

        const newText = e.currentTarget.innerText;
        setInput(newText);

        if (!newText.trim() && e.currentTarget.innerHTML === "<br>") {
            e.currentTarget.innerHTML = "";
        }

        // Predictive suggestion — only outside token wrappers
        if (!activeTrigger && !activeWrapperType) {
            const beforeCursor = textBeforeCursor.slice(0, cursorOffset);
            const lastSpaceIdx = Math.max(beforeCursor.lastIndexOf(" "), beforeCursor.lastIndexOf("\n"));
            const lastWord = beforeCursor.slice(lastSpaceIdx + 1);
            const match = matchPrediction(lastWord, PREDICTIVE_SUGGESTIONS);

            if (match) {
                setPredictiveMatch({
                    ...match,
                    typedWord: lastWord,
                    startOffset: cursorOffset - lastWord.length,
                });
                const sel2 = window.getSelection();
                if (sel2 && sel2.rangeCount > 0) {
                    const r2 = sel2.getRangeAt(0).cloneRange();
                    r2.collapse(true);
                    const rect = r2.getBoundingClientRect();
                    if (suggestionAnchorRef.current) {
                        suggestionAnchorRef.current.style.left = `${rect.left + window.scrollX}px`;
                        suggestionAnchorRef.current.style.top = `${rect.top + window.scrollY}px`;
                    }
                }
            } else {
                setPredictiveMatch(null);
            }
        } else {
            setPredictiveMatch(null);
        }

        requestAnimationFrame(autoResize);
    };

    const acceptSuggestion = (
        match: PredictiveSuggestion & { typedWord: string; startOffset: number }
    ) => {
        setPredictiveMatch(null);
        const div = textareaRef.current;
        if (!div) return;

        const savedRange = savedRangeRef.current;
        if (savedRange) {
            const sel = window.getSelection();
            if (sel) { sel.removeAllRanges(); sel.addRange(savedRange); }
        }

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const node = range.startContainer;
            if (node.nodeType === Node.TEXT_NODE && node.textContent) {
                const endOffset = range.startOffset;
                const startOffset = endOffset - match.typedWord.length;
                if (startOffset >= 0) {
                    range.setStart(node, startOffset);
                    range.setEnd(node, endOffset);
                    range.deleteContents();
                }
            }
        }

        handleOptionSelectRef.current?.(match.tokenKey);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (activeDropdown === "trigger" || activeDropdown === "add") {
            const options = activeDropdown === "trigger" ? filteredTriggerOptions : quickAddOptions;

            if (options.length > 0) {
                const now = Date.now();
                const isArrowKey = e.key === "ArrowDown" || e.key === "ArrowUp";

                if (isArrowKey && e.repeat && now - lastKeyTime.current < KEY_THROTTLE_MS) {
                    e.preventDefault();
                    return;
                }
                if (isArrowKey) lastKeyTime.current = now;

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
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleOptionSelect(options[activeIndex ?? 0].value);
                    return;
                }
            }
        }

        if (
            e.key === "Enter" &&
            !e.shiftKey &&
            input.trim() !== "" &&
            input.trim().split(/\s+/).length >= 3
        ) {
            e.preventDefault();
            handleSubmit();
            return;
        }

        if (e.key === "Tab" && predictiveMatch) {
            e.preventDefault();
            acceptSuggestion(predictiveMatch);
            return;
        }

        if (e.key.startsWith("Arrow")) setPredictiveMatch(null);

        // Keys while caret is inside a token value input
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const valueInput = getValueInputNode(range.startContainer);

            if (valueInput) {
                const wrapper = getWrapperNode(valueInput);
                if (wrapper) {
                    const textContent = valueInput.textContent || "";
                    const wrapperType = wrapper.getAttribute("data-type");

                    // Block printable keystrokes in the first input of dropdown-picker types while
                    // the dropdown is open — forward them to the portal search input instead
                    const isFirstInput =
                        wrapper.querySelectorAll(".static-value-input")[0] === valueInput;
                    if (
                        isFirstInput &&
                        wrapperType &&
                        DROPDOWN_PICKER_TYPES.includes(wrapperType) &&
                        activeDropdown === "trigger" &&
                        e.key.length === 1
                    ) {
                        e.preventDefault();
                        if (searchInputRef.current) {
                            searchInputRef.current.focus();
                            const nativeInput = searchInputRef.current;
                            const setter = Object.getOwnPropertyDescriptor(
                                window.HTMLInputElement.prototype,
                                "value"
                            )?.set;
                            setter?.call(nativeInput, nativeInput.value + e.key);
                            nativeInput.dispatchEvent(new Event("input", { bubbles: true }));
                        }
                        return;
                    }

                    // Arrow navigation in open trigger dropdown
                    if (activeDropdown === "trigger" && filteredTriggerOptions.length > 0) {
                        const now = Date.now();
                        const isArrowKey = e.key === "ArrowDown" || e.key === "ArrowUp";
                        if (isArrowKey && e.repeat && now - lastKeyTime.current < KEY_THROTTLE_MS) {
                            e.preventDefault();
                            return;
                        }
                        if (isArrowKey) lastKeyTime.current = now;

                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setActiveIndex((prev) =>
                                prev === null ? 0 : (prev + 1) % filteredTriggerOptions.length
                            );
                            return;
                        }
                        if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setActiveIndex((prev) =>
                                prev === null
                                    ? filteredTriggerOptions.length - 1
                                    : (prev - 1 + filteredTriggerOptions.length) % filteredTriggerOptions.length
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
                        if (e.key === "Enter") { e.preventDefault(); return; }

                        // Backspace on an empty wrapper deletes the whole token
                        if (e.key === "Backspace" && range.startOffset === 0) {
                            e.preventDefault();
                            const nextSibling = wrapper.nextSibling;
                            wrapper.remove();
                            if (
                                nextSibling?.nodeType === Node.TEXT_NODE &&
                                nextSibling.textContent === "\u00A0"
                            ) {
                                nextSibling.remove();
                            }

                            setActiveDropdown(null);
                            setActiveWrapperType(null);
                            setActiveIndex(null);
                            setSearchQuery("");
                            activeWrapperRef.current = null;
                            setSectionChip(null);

                            setTimeout(() => {
                                if (textareaRef.current) {
                                    setInput(textareaRef.current.innerText);
                                    textareaRef.current.focus();
                                    const sel = window.getSelection();
                                    if (sel) {
                                        const r = document.createRange();
                                        r.selectNodeContents(textareaRef.current);
                                        r.collapse(false);
                                        sel.removeAllRanges();
                                        sel.addRange(r);
                                    }
                                }
                            }, 0);
                            return;
                        }
                    }
                }
            }
        }

        // Backspace: delete preceding token wrapper when caret is right after it
        if (e.key === "Backspace") {
            const sel = window.getSelection();
            if (!sel || !sel.isCollapsed) return;

            const range = sel.getRangeAt(0);
            const startNode = range.startContainer;
            const startOffset = range.startOffset;

            const isTokenEl = (node: Node | null): boolean =>
                node?.nodeType === Node.ELEMENT_NODE &&
                ((node as HTMLElement).classList.contains("static-data-wrapper") ||
                    (node as HTMLElement).classList.contains("mention-badge"));

            if (startNode.nodeType === Node.TEXT_NODE) {
                if (startOffset === 0) {
                    const prev = startNode.previousSibling;
                    if (isTokenEl(prev)) { e.preventDefault(); prev!.remove(); return; }
                    if (prev?.nodeType === Node.TEXT_NODE && prev.textContent === "\u00A0") {
                        const badge = prev.previousSibling;
                        if (isTokenEl(badge)) {
                            e.preventDefault(); prev.remove(); badge!.remove(); return;
                        }
                    }
                } else if (startOffset === 1 && startNode.textContent?.charAt(0) === "\u00A0") {
                    const prev = startNode.previousSibling;
                    if (isTokenEl(prev)) {
                        e.preventDefault();
                        prev!.remove();
                        startNode.textContent =
                            startNode.textContent!.length === 1 ? "" : startNode.textContent!.substring(1);
                        return;
                    }
                }
            } else if (startNode.nodeType === Node.ELEMENT_NODE && startOffset > 0) {
                const prevChild = startNode.childNodes[startOffset - 1];
                if (isTokenEl(prevChild)) { e.preventDefault(); prevChild.remove(); return; }
                if (prevChild?.nodeType === Node.TEXT_NODE && prevChild.textContent === "\u00A0") {
                    const badge = prevChild.previousSibling;
                    if (isTokenEl(badge)) {
                        e.preventDefault(); prevChild.remove(); badge!.remove(); return;
                    }
                }
            }

            // Legacy: remove typed trigger-token from plain input string
            const cursorPosition = getCursorOffset(e.currentTarget);
            const textBefore = input.slice(0, cursorPosition);
            let triggerChar: TriggerType = null;
            let triggerIndex = -1;
            const startSearch = Math.max(0, textBefore.length - 50);

            for (let i = textBefore.length - 1; i >= startSearch; i--) {
                if (TRIGGER_CONFIG[textBefore[i]]) {
                    triggerChar = textBefore[i] as TriggerType;
                    triggerIndex = i;
                    break;
                }
            }

            if (triggerChar && triggerIndex !== -1) {
                const tokenValue = textBefore.slice(triggerIndex + 1).trimEnd();
                if (TRIGGER_VALUES[triggerChar]?.has(tokenValue)) {
                    e.preventDefault();
                    setInput(input.slice(0, triggerIndex) + input.slice(cursorPosition));
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

    const handleImprove = () => {
        if (!input.trim() || !textareaRef.current) return;
        const enhancedQuery = input.trim();
        textareaRef.current.innerHTML = "";
        textareaRef.current.innerText = enhancedQuery;
        setInput(enhancedQuery);
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                setCursorOffset(textareaRef.current, enhancedQuery.length);
                autoResize();
            }
        });
    };

    const handleOptionSelect = (option: string, isManual: boolean = false) => {
        if (onOptionClick) {
            const currentPayload = getParsedPayload();
            const handled = onOptionClick(option, currentPayload.query || "");
            if (handled) {
                setActiveDropdown(null);
                setTriggerStartIndex(null);
                setSearchQuery("");
                setActiveIndex(null);
                return;
            }
        }

        const div = textareaRef.current;
        const isTokenTypeName =
            Object.keys(tokenConfig).includes(option) || option.startsWith("Court:");

        // ── Case A: setting a VALUE for an already-open wrapper (Judge name, Act name, etc.) ──
        if (activeWrapperType && activeWrapperRef.current && !isTokenTypeName) {
            const wrapper = activeWrapperRef.current;
            const firstInput = wrapper.querySelector(".static-value-input") as HTMLElement | null;

            if (firstInput) {
                const currentText = (firstInput.textContent || "").trim();
                // If it's a multi-select type and the user just typed a comma, append it
                if (currentText.endsWith(",") && DROPDOWN_PICKER_TYPES.includes(activeWrapperType)) {
                    firstInput.textContent = currentText + " " + option;
                } else {
                    firstInput.textContent = option;
                }
            }

            if (activeWrapperType === "Act") {
                // Keep the wrapper ref live for the section chip to reference
                setActiveTrigger(null);
                setTriggerStartIndex(null);
                setActiveDropdown(null);
                setActiveIndex(null);
                triggerNodeRef.current = null;
                showSectionChip(wrapper);
                if (div) setInput(div.innerText);
                return;
            }

            // Judge / Case / Appellant / Respondent — exit the wrapper
            const space = document.createTextNode("\u00A0");
            wrapper.after(space);

            setActiveTrigger(null);
            setTriggerStartIndex(null);
            setActiveDropdown(null);
            activeWrapperRef.current = null;
            setActiveWrapperType(null);
            setActiveIndex(null);
            triggerNodeRef.current = null;

            requestAnimationFrame(() => {
                if (div) {
                    div.focus();
                    const exitRange = document.createRange();
                    exitRange.setStartAfter(space);
                    exitRange.collapse(true);
                    const sel = window.getSelection();
                    if (sel) { sel.removeAllRanges(); sel.addRange(exitRange); }
                    setInput(div.innerText);
                }
            });
            return;
        }

        // ── Case B: caret inside a wrapper's value input ──
        const selection = window.getSelection();
        if (!isTokenTypeName && selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const valInput = getValueInputNode(range.startContainer);
            const wrapper = valInput ? getWrapperNode(valInput) : null;

            if (wrapper && valInput) {
                const wrapperType = wrapper.getAttribute("data-type");

                const currentText = (valInput.textContent || "").trim();
                // If it's a multi-select type and the user just typed a comma, append it
                if (wrapperType && currentText.endsWith(",") && DROPDOWN_PICKER_TYPES.includes(wrapperType)) {
                    valInput.textContent = currentText + " " + option;
                } else {
                    valInput.textContent = option;
                }

                if (wrapperType === "Act") {
                    setActiveTrigger(null);
                    setTriggerStartIndex(null);
                    setActiveDropdown(null);
                    activeWrapperRef.current = wrapper;
                    setActiveWrapperType("Act");
                    setActiveIndex(null);
                    triggerNodeRef.current = null;
                    showSectionChip(wrapper);
                    if (div) setInput(div.innerText);
                    return;
                }

                const space = document.createTextNode("\u00A0");
                wrapper.after(space);

                setActiveTrigger(null);
                setTriggerStartIndex(null);
                setActiveDropdown(null);
                activeWrapperRef.current = null;
                setActiveWrapperType(null);
                setActiveIndex(null);
                triggerNodeRef.current = null;

                requestAnimationFrame(() => {
                    if (div) {
                        div.focus();
                        const exitRange = document.createRange();
                        exitRange.setStartAfter(space);
                        exitRange.collapse(true);
                        const sel2 = window.getSelection();
                        if (sel2) { sel2.removeAllRanges(); sel2.addRange(exitRange); }
                        setInput(div.innerText);
                    }
                });
                return;
            }
        }

        // ── Case C: inserting a brand-new token wrapper ──
        const isStaticType = isTokenTypeName;
        const isTriggerOption = activeTrigger === "@" || activeTrigger === "/";

        const insertRange = document.createRange();

        if (!isManual && triggerNodeRef.current && activeTrigger && triggerStartIndex !== null) {
            const { node, offset: trigOffset } = triggerNodeRef.current;
            insertRange.setStart(node, trigOffset);
            insertRange.setEnd(node, lastCursorOffset.current);
            insertRange.deleteContents();
            triggerNodeRef.current = null;
        } else if (div) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const selRange = sel.getRangeAt(0);
                if (div.contains(selRange.startContainer)) {
                    insertRange.setStart(selRange.startContainer, selRange.startOffset);
                    insertRange.collapse(true);
                } else {
                    insertRange.selectNodeContents(div);
                    insertRange.collapse(false);
                }
            } else {
                insertRange.selectNodeContents(div);
                insertRange.collapse(false);
            }
        } else if (!isStaticType) {
            return;
        }

        if (isStaticType || activeTrigger === "[") {
            // Remove an existing empty wrapper at the caret position
            let currentWrapper: HTMLElement | null = null;
            if (insertRange.startContainer.nodeType === Node.ELEMENT_NODE) {
                const el = insertRange.startContainer as HTMLElement;
                currentWrapper = el.classList.contains("static-data-wrapper")
                    ? el
                    : el.closest(".static-data-wrapper");
            } else if (insertRange.startContainer.parentNode) {
                currentWrapper = (
                    insertRange.startContainer.parentNode as HTMLElement
                ).closest(".static-data-wrapper");
            }

            if (currentWrapper) {
                const inputs = currentWrapper.querySelectorAll(".static-value-input");
                const isEmpty = Array.from(inputs).every(
                    (inp) => !inp.textContent || inp.textContent.trim() === ""
                );
                if (isEmpty) {
                    insertRange.setStartBefore(currentWrapper);
                    insertRange.collapse(true);
                    currentWrapper.remove();
                } else {
                    insertRange.setStartAfter(currentWrapper);
                    insertRange.collapse(true);
                }
            }

            let typeKey = option;
            let prefilledValue = "";
            if (option.startsWith("Court:")) {
                prefilledValue = option.substring(6);
                typeKey = "Court";
            }

            const config = tokenConfig[typeKey] || DEFAULT_TOKEN_CONFIG[typeKey];
            if (config) {
                const wrapper = document.createElement("span");
                wrapper.className = "static-data-wrapper";
                wrapper.style.color = "var(--color-color-text-primary-default)";
                wrapper.style.fontWeight = "400";
                wrapper.contentEditable = "false";
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
                        // Hide the separator together with its input — both revealed on section accept
                        separator.style.display = "none";
                        separator.className = "static-section-separator";
                        wrapper.appendChild(separator);
                    }

                    const inputSpan = document.createElement("span");
                    inputSpan.className = "static-value-input";
                    inputSpan.style.outline = "none";
                    inputSpan.style.minWidth = "10px";
                    inputSpan.style.display = "inline-block";

                    if (idx === 0) {
                        inputSpan.contentEditable = "true";
                        if (prefilledValue) inputSpan.textContent = prefilledValue;
                    } else {
                        // Secondary inputs (e.g. Act section) start hidden.
                        // Both the separator and this input are revealed when user accepts the chip.
                        inputSpan.contentEditable = "false";
                        inputSpan.style.display = "none";
                    }

                    wrapper.appendChild(inputSpan);
                });

                const suffix = document.createElement("span");
                suffix.textContent = config.suffix;
                wrapper.appendChild(suffix);

                insertRange.insertNode(wrapper);
                activeWrapperRef.current = wrapper;

                const firstInput = wrapper.querySelectorAll(".static-value-input")[0] as
                    | HTMLElement
                    | undefined;

                if (firstInput && !DROPDOWN_PICKER_TYPES.includes(typeKey)) {
                    // Free-text type: focus the first input immediately
                    setTimeout(() => {
                        firstInput.focus();
                        const sel = window.getSelection();
                        if (sel) {
                            const r = document.createRange();
                            r.selectNodeContents(firstInput);
                            r.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(r);
                        }
                    }, 10);
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

            insertRange.insertNode(badge);
            const space = document.createTextNode("\u00A0");
            badge.after(space);

            const newRange = document.createRange();
            newRange.setStartAfter(space);
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
        }

        // Open the value picker for dropdown-first types
        if (DROPDOWN_PICKER_TYPES.includes(option)) {
            setActiveTrigger(null);
            setActiveDropdown("trigger");
            setActiveWrapperType(option);
            setSearchQuery("");
            setActiveIndex(null);
            setTimeout(() => searchInputRef.current?.focus(), 30);
        } else {
            setActiveTrigger(null);
            setTriggerStartIndex(null);
            setActiveDropdown(null);
            setSearchQuery("");
        }

        if (div) setInput(div.innerText);
    };

    handleOptionSelectRef.current = handleOptionSelect;

    const toggleDropdown = (dropdown: "add" | "settings" | "folder") => {
        setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    const renderTriggerDropdown = () => {
        if (activeDropdown !== "trigger") return null;
        if (!activeTrigger && !activeWrapperType) return null;
        if (activeWrapperType && !DROPDOWN_PICKER_TYPES.includes(activeWrapperType)) return null;

        const config = activeTrigger ? TRIGGER_CONFIG[activeTrigger] : { renderType: "flat" };
        const options = filteredTriggerOptions;

        return createPortal(
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-9999">
                <div className="animate-dropdown-enter">
                    {config.renderType === "nested" ? (
                        <NestedDropdown
                            options={options}
                            value={null}
                            onChange={handleOptionSelect}
                            activeIndex={activeIndex}
                        />
                    ) : activeWrapperType ? (
                        // Picker for Judge / Case / Act / etc.
                        // Search input is auto-focused; printable keys typed in the
                        // contentEditable are forwarded here via handleKeyDown
                        <Dropdown
                            key={activeWrapperType}
                            options={options as DropdownOption[]}
                            value={null}
                            onChange={handleOptionSelect}
                            searchbar="attached"
                            placeholder={`Search ${activeWrapperType}...`}
                            activeIndex={activeIndex}
                            searchInputRef={searchInputRef}
                            autoFocusSearch={true}
                        />
                    ) : activeTrigger === "@" ? (
                        // @ Mention — custom search dropdown (model-dropdown style)
                        <MentionDropdown
                            options={(options as DropdownOption[]).map((o) => ({
                                value: o.value,
                                title: o.title,
                                subtext: typeof o.subtext === 'string' ? o.subtext : undefined,
                            }))}
                            activeIndex={activeIndex}
                            onChange={handleOptionSelect}
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
        if (!["add", "settings", "folder", "project"].includes(activeDropdown)) return null;

        return createPortal(
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-9999">
                <div className="animate-dropdown-enter">
                    {activeDropdown === "add" ? (
                        <NestedDropdown
                            options={quickAddOptions}
                            value={null}
                            onChange={(value) => {
                                handleOptionSelect(value, true);
                                if (!DROPDOWN_PICKER_TYPES.includes(value)) setActiveDropdown(null);
                                setActiveIndex(null);
                            }}
                            activeIndex={activeIndex}
                            customComponents={{}}
                        />
                    ) : activeDropdown === "settings" ? (
                        <SearchScopeSelector
                            availableScopes={scopes}
                            selectedScopes={selectedScopes}
                            onScopeSelect={(scope) => {
                                if (!selectedScopes.includes(scope))
                                    setSelectedScopes([...selectedScopes, scope]);
                            }}
                            onScopeRemove={(scope) =>
                                setSelectedScopes(selectedScopes.filter((s) => s !== scope))
                            }
                        />
                    ) : activeDropdown === "project" ? (
                        <ProjectChoiceDropdown
                            projects={
                                projects.length > 0
                                    ? projects
                                    : [
                                        { id: "1", name: "Default Project", description: "Your main workspace" },
                                        { id: "2", name: "Legal Research 2024", description: "Active cases" },
                                        { id: "3", name: "Appeals Q1", description: "Archived" },
                                    ]
                            }
                            selectedProjectId={null}
                            onSelect={() => {
                                if (onProjectClick) onProjectClick();
                                setActiveDropdown(null);
                            }}
                        />
                    ) : (
                        <div className="w-[350px]">
                            <CourtSelector
                                categories={courtCategories}
                                selectedCourts={effectiveSelectedCourts}
                                onCourtSelect={(court) =>
                                    handleCourtsChange([...effectiveSelectedCourts, court])
                                }
                                onCourtDeselect={(court) =>
                                    handleCourtsChange(effectiveSelectedCourts.filter((c) => c !== court))
                                }
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
                "flex flex-col w-full transition-all items-center",
                isCentered ? "h-fit justify-center" : "h-full justify-end"
            )}
        >
            <div className="relative w-full flex flex-col items-center min-h-fit">
                {/* Project selector */}
                <div className="w-full flex justify-start mb-2 pl-4">
                    <button
                        onClick={() =>
                            setActiveDropdown((prev) => (prev === "project" ? null : "project"))
                        }
                        ref={projectBtnRef}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-style-body-default-regular text-color-text-neutral-secondary hover:text-color-text-primary-default hover:bg-color-surface-neutral-hover_default transition-colors w-fit"
                    >
                        <Icon
                            name="folder-a"
                            className="w-4 h-4 text-color-icon-neutral-secondary shrink-0 -mt-0.5"
                        />
                        <span>{projectLabel}</span>
                    </button>
                </div>

                {helperText && (
                    <div
                        className="absolute w-full h-full z-0 rounded-t-2xl px-4 py-2 text-sm bg-color-surface-primary-subtle_bg"
                        style={{ bottom: 34 }}
                    >
                        <span>{helperText}</span>
                    </div>
                )}

                <div className="relative w-full z-10 border border-color-border-neutral-default rounded-2xl bg-color-surface-neutral-default p-4 flex flex-col">
                    {/* Editable text area */}
                    <div
                        contentEditable={true}
                        ref={(node) => { textareaRef.current = node; }}
                        {...getReferenceProps()}
                        data-placeholder="Ask anything. Type @ for mentions. / for commands."
                        className="content-editable w-full resize-none focus:outline-none leading-6 transition-[height] duration-150 ease-out empty:before:content-[attr(data-placeholder)] empty:before:text-color-text-neutral-placeholder [&:empty:before]:pointer-events-none before:content-[attr(data-placeholder)] before:text-color-text-neutral-placeholder [&>br]:hidden [&:not(:empty):before]:hidden inline-block"
                        style={{ height: isCentered ? CENTER_HEIGHT : BOTTOM_HEIGHT }}
                        onInput={handleTextChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onBlur={() => {
                            const sel = window.getSelection();
                            if (sel && sel.rangeCount > 0) {
                                savedRangeRef.current = sel.getRangeAt(0).cloneRange();
                            }
                        }}
                    />

                    {/* Bottom action bar */}
                    <div className="w-full flex items-center justify-between flex-wrap gap-y-2">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsContextDialogOpen(true)}
                                className="inline-flex items-center gap-1 p-2 rounded text-style-body-default-regular text-color-text-neutral-secondary hover:text-color-text-primary-default hover:bg-color-surface-neutral-hover_default transition-colors"
                            >
                                <Icon name="add" className="w-4 h-4 text-color-icon-neutral-secondary shrink-0" />
                                Add context
                            </button>

                            <button
                                onClick={() => toggleDropdown("folder")}
                                ref={folderBtnRef}
                                className={`text-style-body-default-regular ${cn(
                                    "inline-flex items-center gap-1 p-2 rounded hover:text-color-text-primary-default hover:bg-color-surface-neutral-hover_default transition-colors",
                                    activeDropdown === "folder"
                                        ? "bg-color-surface-primary-subtle_bg text-color-text-primary-default"
                                        : "text-color-text-neutral-secondary"
                                )}`}
                            >
                                <Icon
                                    name="courthouse"
                                    className="w-4 h-4 text-color-icon-neutral-secondary shrink-0"
                                />
                                Jurisdiction
                            </button>

                            <button
                                onClick={() => toggleDropdown("settings")}
                                ref={settingsBtnRef}
                                className={`text-style-body-default-regular ${cn(
                                    "inline-flex items-center gap-1 p-2 rounded hover:text-color-text-primary-default hover:bg-color-surface-neutral-hover_default transition-colors",
                                    activeDropdown === "settings"
                                        ? "bg-color-surface-primary-subtle_bg text-color-text-primary-default"
                                        : "text-color-text-neutral-secondary"
                                )}`}
                            >
                                <Icon
                                    name="filter"
                                    className="w-4 h-4 text-color-icon-neutral-secondary shrink-0"
                                />
                                Filters
                            </button>

                            <button
                                onClick={handleImprove}
                                className="inline-flex items-center gap-1 p-2 rounded text-style-body-default-regular text-color-text-neutral-secondary hover:text-color-text-primary-default hover:bg-color-surface-neutral-hover_default transition-colors"
                            >
                                <Icon
                                    name="flash-a"
                                    className="w-4 h-4 text-color-icon-neutral-secondary shrink-0"
                                />
                                Improve
                            </button>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <ModelDropdown modelName={modelName} onChange={setModelName} />

                            <IconButton
                                onClick={isLoading ? onStop : handleSubmit}
                                color={isLoading ? "neutral" : "primary"}
                                icon={isLoading ? "stop" : "arrow-up-d"}
                                size="medium"
                                corner="sharp"
                                boundary="stroked"
                                className="h-[32px] w-[32px]"
                                disabled={
                                    !isLoading &&
                                    (!input.trim() || input.trim().split(/\s+/).length < 3)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {renderTriggerDropdown()}
            {renderButtonDropdown()}

            {/* Add to context dialog */}
            <Dialog open={isContextDialogOpen} onOpenChange={setIsContextDialogOpen}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[672px]">
                    <DialogTitle className="sr-only">Add to context</DialogTitle>
                    <AddToContext
                        onSave={() => setIsContextDialogOpen(false)}
                        onCancel={() => setIsContextDialogOpen(false)}
                        onClose={() => setIsContextDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Invisible anchor for predictive suggestion chip positioning */}
            <span
                ref={suggestionAnchorRef}
                aria-hidden
                style={{ position: "fixed", pointerEvents: "none", width: 0, height: 0 }}
            />

            {/* Predictive suggestion floating chip */}
            {predictiveMatch &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            left: suggestionAnchorRef.current
                                ? parseFloat(suggestionAnchorRef.current.style.left) - window.scrollX
                                : 0,
                            top: suggestionAnchorRef.current
                                ? parseFloat(suggestionAnchorRef.current.style.top) - window.scrollY + 10
                                : 0,
                            zIndex: 9999,
                        }}
                        className="animate-dropdown-enter"
                    >
                        <Option
                            title={predictiveMatch.option}
                            selected
                            onClick={() => acceptSuggestion(predictiveMatch)}
                            className="cursor-pointer shadow-md bg-color-surface-neutral-default"
                        />
                    </div>,
                    document.body
                )}

            {/* "Enter Section" floating chip — appears after an Act name is chosen */}
            {sectionChip &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            left: sectionChip.x,
                            top: sectionChip.y,
                            zIndex: 9999,
                        }}
                        className="animate-dropdown-enter flex items-center gap-1"
                    >
                        {/* Accept: reveal and focus the section input */}
                        <button
                            onMouseDown={(e) => {
                                e.preventDefault(); // prevent contentEditable blur
                                activateSectionInput(sectionChip.wrapperEl);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-style-body-sm-medium bg-color-surface-neutral-default border border-color-border-neutral-default text-color-text-primary-default shadow-md hover:bg-color-surface-neutral-hover_default transition-colors"
                        >
                            Enter Section
                        </button>

                        {/* Skip: dismiss chip, close the token without a section */}
                        <button
                            onMouseDown={(e) => {
                                e.preventDefault();
                                skipSectionInput(sectionChip.wrapperEl);
                            }}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-color-surface-neutral-default border border-color-border-neutral-default text-color-text-neutral-secondary shadow-md hover:bg-color-surface-neutral-hover_default transition-colors"
                            title="Skip section"
                        >
                            <Icon name="cross" className="w-3 h-3" />
                        </button>
                    </div>,
                    document.body
                )}
        </div>
    );
}

// ── DOM helpers ──────────────────────────────────────────────────────────────

function getWrapperNode(node: Node | null): HTMLSpanElement | null {
    if (!node) return null;
    if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).classList.contains("static-data-wrapper")
    ) {
        return node as HTMLSpanElement;
    }
    return getWrapperNode(node.parentNode);
}

function getValueInputNode(node: Node | null): HTMLSpanElement | null {
    if (!node) return null;
    if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).classList.contains("static-value-input")
    ) {
        return node as HTMLSpanElement;
    }
    return getValueInputNode(node.parentNode);
}

function getCursorOffset(element: HTMLElement): number {
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

    function traverse(node: Node): boolean {
        if (node.nodeType === Node.TEXT_NODE) {
            const len = node.textContent?.length || 0;
            if (offset >= charCount && offset <= charCount + len) {
                range.setStart(node, offset - charCount);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
                return true;
            }
            charCount += len;
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                if (traverse(node.childNodes[i])) return true;
            }
        }
        return false;
    }

    traverse(element);
}

export default React.memo(SearchEngineInput);