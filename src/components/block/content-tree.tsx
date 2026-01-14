import React from "react";
import { cn } from "@/lib/utils";

export type ContentTreeSection = {
  title: string;
  items: string[];
};

export type ContentTreeProps = {
  sections: ContentTreeSection[];
  className?: string;
};

function ContentTree({ sections, className }: ContentTreeProps) {
  return (
    <div
      className={cn(
        `inline-flex w-[175px] flex-col items-end gap-2 pr-2 
        border-r-2 border-color-border-neutral-default 
        bg-color-surface-neutral-default`
      )}
    >
      <div
        className={cn("flex flex-col items-start w-[166px] gap-2", className)}
      >
        {sections.map((section) => (
          <div className="flex w-[166px] flex-col items-start">
            <div className="flex items-center gap-2 p-1 self-stretch">
              <p className="text-color-text-neutral-default text-style-body-default-regular">
                {section.title}
              </p>
            </div>

            <div className="flex p-2 content-end items-center gap-2 self-stretch ">
              <div className="flex ml-auto w-[132px] flex-col items-start gap-1">
                {/*  tabs  */}
                {section.items.map((item) => (
                  <div
                    key={item}
                    title={item}
                    className="flex w-[132px] flex-col items-start gap-2 p-1 
                    cursor-pointer transition-colors rounded-[4px] 
                    hover:bg-color-surface-neutral-hover_default"
                  >
                    <div className="flex items-center gap-2 p-1 self-stretch">
                      <p className="p-1 text-color-color-text-neutral-secondary text-style-label-title-regular">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentTree;
