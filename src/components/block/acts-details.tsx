import React from "react";
import { Icon } from "judix-icon";
import ActsContentTree, { ActsContentTreeSection } from "./acts-content-tree";
import { Input, Button, Label } from "../ui";

export type ActsDetailsProps = {
  actTitle: string;
  contentSections?: ActsContentTreeSection[];
  activeItem?: string;
  onItemClick?: (sectionTitle: string, item: string) => void;
  content?: {
    title: string;
    body: React.ReactNode;
  }[];
  className?: string;
};

function ActsDetails({
  actTitle,
  contentSections,
  activeItem,
  onItemClick,
  content,
  className,
}: ActsDetailsProps) {
  return (
    <div
      className="flex w-full max-w-[1200px] h-[680px] flex-col items-start gap-2 p-4
      rounded-modal bg-color-surface-neutral-default"
    >
      {/* Main */}
      <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
        {/* Header */}
        <div className="flex items-start gap-4 self-stretch">
          <div className="flex flex-col items-start gap-3 flex-1">
            <div className="flex items-center gap-2 p-1 self-stretch">
              <p
                className="flex-1 line-clamp-1 overflow-hidden text-ellipsis 
                text-color-text-neutral-default text-style-body-title-regular"
              >
                {actTitle}
              </p>
            </div>

            <Input
              className="flex max-w-[600px] flex-col items-start justify-center 
              gap-2 px-3 py-2 self-stretch rounded-textinput-border-radius-default 
              textinput-border-weight-default border-color-textinput-color-stroke-default 
              bg-color-textinput-bg"
              placeholder="Search in here."
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => {}}
              className="flex h-8 items-center justify-center gap-2 px-3 py-1.5 
              rounded-button-border-radius-default button-border-weight-default 
              border-color-button-color-neutral-default-stroke bg-color-button-color-neutral-default-bg"
              size="extraSmall"
              suffixIcon="ArrowDown"
              variant="neutral"
            >
              Continue
            </Button>

            <Icon
              name="Add"
              color="neutral"
              className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
            />

            <Icon
              name="Export2"
              color="neutral"
              className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
            />
            <Icon
              name="Export2"
              color="neutral"
              className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
            />
            <Icon
              name="Export2"
              color="neutral"
              className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
            />

            <Label
              className="flex h-8 items-center justify-center gap-2 px-3 py-2 
              rounded-label-border-radius-default label-border-weight-default 
              border-color-label-color-neutral-stroke bg-color-label-color-neutral-bg"
              colorScheme="neutral"
              onClick={() => {}}
              onSelect={() => {}}
              size="medium"
            >
              Visit India Code
            </Label>
          </div>
        </div>

        <hr className="w-full max-w-[1168px] h-[1px] border-color-border-neutral-default" />

        {/* Body */}
        <div className="flex items-start gap-2 flex-1 self-stretch">
          {/* Sidebar */}
          {contentSections && (
            <ActsContentTree
              sections={contentSections}
              activeItem={activeItem}
              onItemClick={onItemClick}
            />
          )}

          {/* Content */}
          {content &&
            content.map((item, index) => (
              <React.Fragment key={index}>
                {item.body}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ActsDetails;
