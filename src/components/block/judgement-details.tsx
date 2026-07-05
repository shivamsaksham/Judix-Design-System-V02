import React from "react";
import { cn } from "../../lib/utils";
import { ContentTree, ContentTreeSection } from "./content-tree";
import ScoreBox from "./score-box";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { IconButton } from "../ui/icon-button";

export type JudgementDetailsProps = {
  caseTitle: string;
  status?: "Overruled" | "Upheld" | "Modified" | string;
  score?: string;
  scoreSubtitle?: string;
  contentSections?: ContentTreeSection[];
  content?: {
    title: string;
    items: string[];
  }[];
  activeItemId?: string;
  onItemClick?: (sectionId: string, itemId: string) => void;
  onBack?: () => void;
  children?: React.ReactNode;
  className?: string;
};

function JudgementDetails({
  caseTitle,
  status,
  score = "93.42%",
  scoreSubtitle = "Similar to issues",
  contentSections,
  content,
  activeItemId,
  onItemClick,
  onBack,
  children,
  className,
}: JudgementDetailsProps) {
  return (
    <div
      className={cn(
        "flex w-full h-full flex-col items-start gap-2 bg-color-surface-neutral-default overflow-hidden",
        className
      )}
    >
      {/* main */}
      <div className="flex flex-col items-start gap-4 flex-1 self-stretch overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start gap-x-4 gap-y-4 self-stretch pr-4">
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="flex p-1 items-center gap-2 self-stretch">
              {onBack && (
                <IconButton
                  icon="arrow-left-a"
                  variant="neutral"
                  size="medium"
                  onClick={onBack}
                  className="mr-2 shrink-0"
                />
              )}
              <h1
                className="flex-1 line-clamp-2 overflow-hidden text-ellipsis 
              text-color-text-neutral-default text-style-body-title-regular"
              >
                {caseTitle}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {status && (
                <Label
                  size="medium"
                  className="bg-red-50 text-red-600 border border-red-200 h-8 flex items-center"
                >
                  {status}
                </Label>
              )}

              <Button variant="neutral" size="medium" className="h-8 px-3 border border-color-border-neutral-default">
                View SCR copy
              </Button>

              <div className="flex md:hidden">
                <ScoreBox title="" score={score} subtitle={scoreSubtitle} variant="badge" />
              </div>

              <div className="flex items-center gap-1">
                <IconButton icon="add" variant="neutral" size="medium" />
                <IconButton icon="at" variant="neutral" size="medium" />
                <IconButton icon="save-b" variant="neutral" size="medium" />
                <IconButton icon="share-a" variant="neutral" size="medium" />
              </div>
            </div>
          </div>

          <div className="hidden md:flex">
            <ScoreBox title="" score={score} subtitle={scoreSubtitle} />
          </div>
        </div>

        <hr className="w-full h-[1px] bg-color-border-neutral-default border-none" />

        <div className="flex items-start gap-2 flex-1 self-stretch overflow-hidden">
          {/* Frame 6082 */}
          {contentSections && (
            <aside className="hidden md:block w-[240px] shrink-0 overflow-y-auto border-r border-color-border-neutral-default custom-scrollbar">
              <ContentTree
                sections={contentSections}
                activeItemId={activeItemId}
                onItemClick={onItemClick}
                className="w-full"
              />
            </aside>
          )}

          <main className="flex flex-col items-start gap-4 flex-1 self-stretch bg-color-surface-neutral-default overflow-y-auto overflow-x-hidden pb-20 custom-scrollbar scroll-smooth">
            {children ? (
              children
            ) : content ? (
              content.map((section) => (
                <div key={section.title}>{/* future content rendering */}</div>
              ))
            ) : (
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default JudgementDetails;
