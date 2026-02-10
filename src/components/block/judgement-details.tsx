import React, { useRef, useEffect, useState } from "react";
import { Icon } from "@judix/icon";
import ContentTree, { ContentTreeSection } from "./content-tree";
import ScoreBox from "./score-box";
import { Label } from "../ui/label";
import JudgmentDetailsContent, {
  JudgmentData,
} from "./judgment-details-content";

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
  judgmentData?: JudgmentData;
  className?: string;
};

function JudgementDetails({
  caseTitle,
  status,
  score = "93.46%",
  scoreSubtitle = "Similar to issues",
  contentSections,
  judgmentData,
  content,
  className,
}: JudgementDetailsProps) {
  const [activeItem, setActiveItem] = useState<string | undefined>();
  const contentRef = useRef<HTMLElement>(null);

  const handleItemClick = (_sectionTitle: string, itemId: string) => {
    setActiveItem(itemId);

    const container = contentRef.current;
    const target = document.getElementById(itemId);

    if (!container || !target) return;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;

    container.scrollTo({
      top: target.offsetTop - container.offsetTop - 8,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("section[id]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveItem(visibleEntry.target.id);
        }
      },
      {
        root: container,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [judgmentData]);

  return (
    <div className="h-screen flex">
      <div
        className="flex w-full h-full flex-col items-start gap-2 p-4 
    rounded-modal bg-color-surface-neutral-default"
      >
        {/* main */}
        <div className="flex flex-col items-start gap-4 flex-1 self-stretch min-h-0">
          {/* Frame 6083 */}

          <div className="flex flex-start gap-4 self-stretch">
            {/* Frame 6073 */}

            <div className="flex flex-col flex-start gap-3 flex-1">
              {/* Frame 6072 */}

              <div className="flex p-1 content-center items-center gap-2 self-stretch">
                {/* Frame 6071 */}
                <p
                  className="flex-1 line-clamp-1 overflow-hidden text-ellipsis 
              text-color-text-neutral-default text-style-body-title-regular"
                >
                  {caseTitle}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Frame 5968 */}

                {status && (
                  <Label
                    size="medium"
                    color="neutral"
                    className="flex h-8 items-center justify-center gap-2 px-3 py-2 
                rounded-label-border-radius-default label-border-weight-default 
                border-color-border-feedback-error-strong bg-color-label-color-neutral-bg"
                  >
                    <p className="text-color-text-feedback-error-default text-style-body-default-regular">
                      {status}
                    </p>
                  </Label>
                )}
                <Label
                  size="medium"
                  color="neutral"
                  className="flex h-8 items-center justify-center gap-2 px-3 py-2 
                rounded-label-border-radius-default label-border-weight-default 
                bg-color-label-color-neutral-bg"
                >
                  <p className=" text-style-body-default-regular">
                    View SCR copy
                  </p>
                </Label>

                <Icon
                  name="add"
                  color="neutral"
                  className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
                />

                <Icon
                  name="at"
                  color="neutral"
                  className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
                />

                <Icon
                  name="save-b"
                  color="neutral"
                  className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
                />

                <Icon
                  name="share-a"
                  color="neutral"
                  className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
                />
              </div>
            </div>

            <ScoreBox title="" score={score} subtitle={scoreSubtitle} />
          </div>

          <hr className="w-full max-w-[1168px] h-[1px] border-color-border-neutral-default" />

          <div className="flex items-stretch gap-2 flex-1 self-stretch overflow-hidden min-h-0">
            {/* Frame 6082 */}
            {contentSections && (
              <ContentTree
                sections={contentSections}
                activeItemId={activeItem}
                onItemClick={handleItemClick}
              />
            )}

            <main
              ref={contentRef}
              className="flex-1 overflow-y-auto overscroll-contain min-w-0 overflow-x-hidden"
            >
              {judgmentData ? (
                <JudgmentDetailsContent data={judgmentData} />
              ) : (
                <p>No content available.</p>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JudgementDetails;
