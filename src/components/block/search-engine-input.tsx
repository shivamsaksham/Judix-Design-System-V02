"use client";
import React, { useRef, useState, useCallback, useMemo } from "react";
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
import NestedDropdown from "@/components/block/custom-dropdown-helper";
import { SearchScopeSelector } from "./search-scope-selector";
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
  folderOptions?: DropdownOption[];
  quickAddOptions?: OptionHelper[];
  triggers?: Record<string, TriggerConfig>;
  staticData?: StaticDataConfig;
  tokenConfig?: Record<string, TokenStructure>;
  onSubmit?: (payload: SearchPayload) => void;
}

function SearchEngineInput({
  helperText,
  scopes = [],
  courtCategories = [],
  folderOptions = [],
  quickAddOptions = [],
  triggers = {},
  staticData = {},
  tokenConfig = DEFAULT_TOKEN_CONFIG,
  onSubmit
}: SearchEngineInputProps) {
  const TRIGGER_CONFIG = triggers;
  const [isCentered, setIsCentered] = useState(true);
  const [input, setInput] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["Overall search"]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
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
    onOpenChange: (open) => {
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
      // Check if staticData provides options for this type
      if (staticData[activeWrapperType]) {
        return staticData[activeWrapperType];
      }
      // Fallback for default types if passed in staticData (e.g. "Case", "Judge")
      return [];
    }

    if (activeTrigger && triggers[activeTrigger]) {
      return triggers[activeTrigger].options;
    }

    return [];
  }, [activeTrigger, activeWrapperType, triggers, staticData]);

  const filteredTriggerOptions = useMemo(() => {
    if (!triggerOptions) return [];
    if (!searchQuery) return triggerOptions;

    // Normalize string: remove dots, spaces, special chars and convert to lowercase
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedQuery = normalize(searchQuery);

    return triggerOptions.filter((opt: DropdownOption) => {
      const normalizedTitle = normalize(opt.title || "");
      const normalizedValue = normalize(opt.value || "");
      return normalizedTitle.includes(normalizedQuery) || normalizedValue.includes(normalizedQuery);
    });
  }, [triggerOptions, searchQuery]);

  // Refs for event handlers to access latest state
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

      // Special handling for legacy/specific parsing logic if needed,
      // but trying to make it generic based on config

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

      // Generic parsing
      if (config && config.inputs.length === 1 && config.inputs[0].key) {
        const key = config.inputs[0].key;
        const val = valInputs[0].textContent?.trim();
        if (val) filters[key] = val;
      } else if (config) {
        // Fallback or complex types not covered by specific overrides
        config.inputs.forEach((inputConfig, idx) => {
          if (inputConfig.key && valInputs[idx]) {
            const val = valInputs[idx].textContent?.trim();
            if (val) filters[inputConfig.key] = val;
          }
        });
      }
    });

    let queryText = "";
    div.childNodes.forEach(node => {
      if (processedNodes.has(node)) return;
      if (node.nodeType === Node.TEXT_NODE) {
        queryText += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE && !(node as Element).classList.contains("static-data-wrapper")) {
        queryText += node.textContent;
      }
    });

    filters.scopes = selectedScopes;

    return {
      query: queryText.replace(/\s+/g, " ").trim(),
      filters
    };
  }, [selectedScopes, tokenConfig]);

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

    if (e.key === "Enter" && !e.shiftKey && input.trim() !== "") {
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

          if (textContent.trim() === "") {
            if (e.key === "Enter") {
              e.preventDefault();
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
          // Check if previous sibling is a text node containing only &nbsp; and the one before that is a badge
          if (previousNode && previousNode.nodeType === Node.TEXT_NODE && previousNode.textContent === "\u00A0") {
            const badgeNode = previousNode.previousSibling;
            if (badgeNode && badgeNode.nodeType === Node.ELEMENT_NODE && ((badgeNode as HTMLElement).classList.contains("static-data-wrapper") || (badgeNode as HTMLElement).classList.contains("mention-badge"))) {
              e.preventDefault();
              previousNode.remove(); // remove the space
              badgeNode.remove(); // remove the badge
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
            // Handle case where previous node is text node with &nbsp;
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

  const handleOptionSelect = (option: string, isManual: boolean = false) => {
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

          const exitRange = document.createRange();
          const space = document.createTextNode("\u00A0");
          wrapper.after(space);
          exitRange.setStartAfter(space);
          exitRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(exitRange);

          setActiveTrigger(null);
          setTriggerStartIndex(null);
          setActiveDropdown(null);
          activeWrapperRef.current = null;
          setActiveWrapperType(null);

          if (div) setInput(div.innerText);
          return;
        }
      }
    }

    const targetNode = (window as any).activeTriggerNode;
    if (!isManual && (!div || !activeTrigger || triggerStartIndex === null || !targetNode))
      return;


    const range = document.createRange();
    if (!isManual && targetNode) {
      range.setStart(targetNode, triggerStartIndex!);
      range.setEnd(targetNode, lastCursorOffset.current);
      range.deleteContents();
    } else if (isManual) {
      // Manual insertion logic
      const selection = window.getSelection();
      let usedSelection = false;

      if (div && selection && selection.rangeCount > 0) {
        const selRange = selection.getRangeAt(0);
        if (div.contains(selRange.startContainer)) {
          range.setStart(selRange.startContainer, selRange.startOffset);
          range.collapse(true);
          usedSelection = true;
        }
      }

      if (!usedSelection && div) {
        // Fallback to end of div if no valid selection inside div
        range.selectNodeContents(div);
        range.collapse(false);
      }
    }

    const isStaticType = Object.keys(tokenConfig).includes(option) || option.startsWith("Court:");
    const isTriggerOption = activeTrigger === "@" || activeTrigger === "/";

    if (!isStaticType && !isTriggerOption) {
      if (isManual) {
        return;
      }

      const textNode = document.createTextNode(option + " ");
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      if (div) setInput(div.innerText);
      return;
    }

    if (activeTrigger === "[" || isManual) {
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

        // Focus logic
        const inputs = wrapper.querySelectorAll(".static-value-input");
        if (inputs.length > 0) {
          (inputs[0] as HTMLElement).focus();

          // Add focus handlers for multi-input
          if (inputs.length > 1) {
            (inputs[1] as HTMLElement).onfocus = () => {
              if (!inputs[0].textContent || inputs[0].textContent.trim() === "") {
                (inputs[0] as HTMLElement).focus();
              }
            };
          }
        }


      }
    } else {
      if (!activeTrigger) return;
      const badge = document.createElement("span");
      badge.className = "mention-badge";
      badge.setAttribute("data-type", activeTrigger);
      badge.setAttribute("data-value", option);
      badge.style.color = "var(--color-color-text-primary-default)";
      badge.contentEditable = "false";
      badge.textContent = `${activeTrigger}${option}`;

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
    } else {
      setActiveTrigger(null);
      setTriggerStartIndex(null);
      setActiveDropdown(null);
    }
    if (div) setInput(div.innerText);
  };
  const toggleDropdown = (dropdown: "add" | "settings" | "folder") => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const renderTriggerDropdown = () => {
    if (activeDropdown !== "trigger") return null;
    if (!activeTrigger && !activeWrapperType) return null;

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
                add_context: (
                  <CourtSelector
                    categories={courtCategories}
                    selectedCourts={selectedCourts}
                    onCourtSelect={(court) => {
                      if (!selectedCourts.includes(court)) {
                        setSelectedCourts((prev) => [...prev, court]);
                        // Create court token directly without calling handleOptionSelect to prevent dropdown close
                        const div = textareaRef.current;
                        if (div) {
                          const selection = window.getSelection();
                          if (selection) {
                            const range = document.createRange();
                            range.selectNodeContents(div);
                            range.collapse(false);

                            const wrapper = document.createElement("span");
                            wrapper.className = "static-data-wrapper";
                            wrapper.style.color = "var(--color-color-text-primary-default)";
                            wrapper.style.fontWeight = "400";
                            wrapper.contentEditable = "false";
                            wrapper.setAttribute("data-type", "Court");

                            const prefix = document.createElement("span");
                            prefix.textContent = "[Court:-";
                            wrapper.appendChild(prefix);

                            const inputSpan = document.createElement("span");
                            inputSpan.className = "static-value-input";
                            inputSpan.contentEditable = "true";
                            inputSpan.style.outline = "none";
                            inputSpan.style.minWidth = "10px";
                            inputSpan.style.display = "inline-block";
                            inputSpan.textContent = court;
                            wrapper.appendChild(inputSpan);

                            const suffix = document.createElement("span");
                            suffix.textContent = "]";
                            wrapper.appendChild(suffix);

                            range.insertNode(wrapper);
                            const space = document.createTextNode("\u00A0");
                            wrapper.after(space);

                            setInput(div.innerText);
                          }
                        }
                        console.log(`Court selected: ${court}`);
                      }
                    }}
                    onCourtDeselect={(court) => {
                      setSelectedCourts((prev) => prev.filter((c) => c !== court));
                      console.log(`Court deselected: ${court}`);
                    }}
                  />
                ),
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
              <Dropdown
                options={folderOptions}
                value={null}
                onChange={(val) => console.log("Folder selected:", val)}
                searchbar="attached"
                placeholder="Search in here..."
                activeIndex={activeIndex}
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
      className={`flex flex-col h-screen transition-all items-center ${isCentered ? "justify-center" : "justify-end"
        }`}
    >
      <div className="relative w-full flex flex-col items-center min-h-fit">
        {helperText && (
          <div
            className="absolute w-full max-w-3xl h-full z-0 rounded-t-2xl px-4 py-2 text-sm bg-color-surface-primary-subtle_bg"
            style={{ bottom: 34 }}
          >
            <span>{helperText}</span>
          </div>
        )}
        <div className="relative w-full z-10 max-w-3xl border border-gray-300 rounded-2xl px-6 py-4 mb-4 flex flex-col gap-3 items-center justify-around bg-white">
          <div
            contentEditable={true}
            ref={(node) => {
              textareaRef.current = node;
              if (activeDropdown === "trigger") refs.setReference(node);
            }}
            {...getReferenceProps()}
            data-placeholder="Ask anything. Type @ for mentions, / for commands, [ for options."
            className="content-editable w-full resize-none focus:outline-none leading-6 transition-[height] duration-150 ease-out"
            style={{ height: isCentered ? CENTER_HEIGHT : BOTTOM_HEIGHT }}
            onInput={handleTextChange}
            onKeyDown={handleKeyDown}
          />

          <div className="w-full flex items-center justify-between">
            <div className="flex gap-2">
              <IconButton
                onClick={() => toggleDropdown("add")}
                ref={(node) => {
                  if (activeDropdown === "add") refs.setReference(node);
                }}
                color="neutral"
                icon="Add"
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
                icon="Setting4"
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
                icon="Activity"
                size="medium"
                boundary="stroked"
                corner="sharp"
                className={`hover:bg-color-surface-primary-subtle_bg hover:border-color-surface-primary-subtle_bg ${activeDropdown === "folder" ? "bg-color-surface-primary-subtle_bg border-color-surface-primary-subtle_bg" : ""
                  }`}
              />
            </div>
            <div className="flex gap-2 items-center">
              {input.trim().length > 0 && !["/", "@", "["].some(char => input.trim().startsWith(char)) && (
                <Button
                  size="small"
                  className="text-color-text-primary-default bg-color-surface-neutral-default border border-color-surface-primary-default"
                >
                  Enhance Query
                </Button>
              )}
              <IconButton
                onClick={handleSubmit}
                color="primary"
                icon="ArrowUp"
                size="medium"
                boundary="stroked"
                corner="sharp"
                disabled={!input.trim() || input.trim().split(" ").length < 3}
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
