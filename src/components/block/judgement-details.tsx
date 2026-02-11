import React from "react";
import { Icon } from "@judix/icon";
import ContentTree, { ContentTreeSection } from "./content-tree";
import ScoreBox from "./score-box";
import { Label } from "../ui/label";

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
  className?: string;
};

function JudgementDetails({
  caseTitle,
  status,
  score = "93.46%",
  scoreSubtitle = "Similar to issues",
  contentSections,
  content,
}: JudgementDetailsProps) {
  return (
    <div
      className="flex w-full max-w-[1200px] h-[680px] flex-col items-start gap-2 p-4 
    rounded-modal bg-color-surface-neutral-default"
    >
      {/* main */}
      <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
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

              {/* TODO: Add Correct Icons Names from the new icon pack*/}
              <Icon
                name="export-b"
                color="neutral"
                className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
              />

              <Icon
                name="export-b"
                color="neutral"
                className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
              />

              <Icon
                name="export-b"
                color="neutral"
                className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
              />

              <Icon
                name="export-b"
                color="neutral"
                className="flex w-8 h-8 items-center gap-2 p-2 
                aspect-square rounded-icon_button-border-radius-default"
              />
            </div>
          </div>

          <ScoreBox score={score} subtitle={scoreSubtitle} />
        </div>

        <hr className="w-full max-w-[1168px] h-[1px] border-color-border-neutral-default" />

        <div className="flex items-start gap-2 flex-1 self-stretch">
          {/* Frame 6082 */}
          {contentSections && <ContentTree sections={contentSections} />}

          <main className="flex flex-col items-start gap-4 flex-1 self-stretch bg-color-surface-neutral-default">
            {content ? (
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
