import React from "react";
import { cn } from "@/lib/utils";

export type ActsContentTreeSection = {
  title: string;
  items: string[];
};

export type ActsContentTreeProps = {
  sections: ActsContentTreeSection[];
  activeItem?: string;
  onItemClick?: (sectionTitle: string, item: string) => void;
  className?: string;
};

function ActsContentTree({
  sections,
  activeItem,
  onItemClick,
  className,
}: ActsContentTreeProps) {
  return (
    <div
      className={cn(
        `inline-flex h-full flex-col items-end gap-2
border-r border-color-border-neutral-default 
bg-color-surface-neutral-default flex-shrink-0`,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start gap-2 h-full overflow-y-auto overscroll-contain overflow-x-hidden scrollbar-hide",
          className,
        )}
      >
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex w-[166px] flex-col items-start"
          >
            <div className="flex items-center gap-2 p-1 self-stretch">
              <p className="text-color-text-neutral-default text-style-body-default-regular">
                {section.title}
              </p>
            </div>

            <div className="flex p-2 content-end items-center gap-2 self-stretch ">
              <div className="flex ml-auto w-[132px] flex-col items-start gap-1">
                {/*  tabs  */}
                {section.items.map((item) => {
                  const isActive = item === activeItem;

                  return (
                    <div
                      key={item}
                      title={item}
                      onClick={() => onItemClick?.(section.title, item)}
                      className={cn(
                        `flex w-[132px] cursor-pointer flex-col items-start gap-2 
                         rounded-[4px] p-1 transition-colors`,
                        isActive
                          ? "bg-color-surface-neutral-hover_default"
                          : "hover:bg-color-surface-neutral-hover_default",
                      )}
                    >
                      <div className="flex items-center gap-2 p-1 self-stretch">
                        <p className="p-1 text-color-color-text-neutral-secondary text-style-label-title-regular">
                          {item}
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

export default ActsContentTree;
