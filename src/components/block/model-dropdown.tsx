import * as React from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { Icon } from "@judix/icon";
import { cn } from "@/lib/utils";
import { Option } from "@/components/ui/option";

export interface ModelOption {
    title: string;
    value: string;
    icon?: React.ComponentProps<typeof Icon>["name"];
    subtext?: React.ReactNode;
}

const DEFAULT_MODELS: ModelOption[] = [
    {
        title: "Judix-lite v1.4",
        value: "judix-lite",
        icon: "box-a",
        subtext: (
            <div className="flex flex-col gap-1 mt-1 text-color-text-neutral-secondary">
                <span>Best for lightweight research. Good accuracy.</span>
                <span>Uses 1 credit per AI search.</span>
            </div>
        ),
    },
    {
        title: "judix-pro v1.6",
        value: "judix-pro",
        icon: "crown-a",
        subtext: (
            <div className="flex flex-col gap-1 mt-1 text-color-text-neutral-secondary">
                <span>Best for deep research. Highest accuracy.</span>
                <span>Uses 3 credits per AI search.</span>
            </div>
        ),
    },
];

export interface ModelDropdownProps {
    modelName: string;
    onChange: (value: string) => void;
    options?: ModelOption[];
}

export const ModelDropdown = ({ modelName, onChange, options = DEFAULT_MODELS }: ModelDropdownProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const { refs, floatingStyles } = useFloating({
        placement: "top-end",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8),
            flip({ fallbackPlacements: ["bottom-end", "top-start", "bottom-start"] }),
            shift({ padding: 8 }),
        ],
        open: isOpen,
        onOpenChange: setIsOpen,
    });

    const activeModel = options.find((o) => o.title === modelName) || options[0];

    React.useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            // If clicking inside the floating dropdown, ignore it.
            if (
                refs.floating.current &&
                refs.floating.current.contains(e.target as Node)
            ) {
                return;
            }

            // If clicking exactly on the trigger button, it will be naturally handled by the onClick toggle.
            // Easiest is to just close unconditionally. Wait to do it slightly after the toggle click.
            setTimeout(() => setIsOpen(false), 50);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, refs.floating]);

    return (
        <>
            <button
                ref={refs.setReference}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`text-style-body-default-regular ${cn(
                    "inline-flex items-center p-2 transition-colors rounded",
                    isOpen
                        ? "bg-color-surface-primary-subtle_bg text-color-text-primary-default"
                        : "text-color-text-neutral-default hover:bg-color-surface-neutral-hover_default"
                )}`}
            >
                <Icon name={activeModel.icon || "box-a"} className="shrink-0 mr-1" />
                <span>{modelName}</span>
                <Icon name="arrow-down-c" className="w-4 h-4 text-color-icon-neutral-secondary shrink-0 ml-2" />
            </button>

            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="z-50 min-w-[315px] bg-dropdown-color-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default"
                >
                    <div className="p-2 space-y-1">
                        {options.map((option) => (
                            <Option
                                key={option.value}
                                title={option.title}
                                subtext={option.subtext}
                                prefixSlot={option.icon ? <Icon name={option.icon} /> : undefined}
                                selected={activeModel.value === option.value}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    onChange(option.title);
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
