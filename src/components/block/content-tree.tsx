import React from "react";
import { cn } from "@/lib/utils";

export type ContentTreeItem = {
  id: string;
  label: string;
};

export type ContentTreeSection = {
  id: string;
  title: string;
  items: ContentTreeItem[];
};

export type ContentTreeProps = {
  sections: ContentTreeSection[];
  activeItemId?: string;
  onItemClick?: (sectionId: string, itemId: string) => void;
  className?: string;
};

function ContentTree({
  sections,
  activeItemId,
  onItemClick,
  className,
}: ContentTreeProps) {
  return (
    <div
      className={cn(
        `inline-flex h-full flex-col items-end gap-2 pr-2
         border-r border-color-border-neutral-default
         bg-color-surface-neutral-default flex-shrink-0`
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start gap-2 h-full overflow-y-auto overscroll-contain overflow-x-hidden scrollbar-hide",
          className
        )}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex w-[166px] flex-col items-start"
          >
            <div className="flex items-center gap-2 p-1 self-stretch">
              <p className="text-color-text-neutral-default text-style-body-default-regular">
                {section.title}
              </p>
            </div>

            <div className="flex p-2 content-end items-center gap-2 self-stretch">
              <div className="flex ml-auto w-[132px] flex-col items-start gap-1">
                {/* tabs */}
                {section.items.map((item) => {
                  const isActive = item.id === activeItemId;

                  return (
                    <div
                      key={item.id}
                      title={item.label}
                      onClick={() => onItemClick?.(section.id, item.id)}
                      className={cn(
                        `flex w-[132px] cursor-pointer flex-col items-start gap-2
                         rounded-[4px] p-1 transition-colors`,
                        isActive
                          ? "bg-color-surface-neutral-hover_default"
                          : "hover:bg-color-surface-neutral-hover_default"
                      )}
                    >
                      <div className="flex items-center gap-2 p-1 self-stretch">
                        <p className="p-1 text-color-color-text-neutral-secondary text-style-label-title-regular">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentTree;
