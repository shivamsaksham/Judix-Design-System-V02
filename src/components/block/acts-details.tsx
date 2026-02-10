import React, { useRef } from "react";
import { Icon } from "@judix/icon";
import ActsContentTree, { ActsContentTreeSection } from "./acts-content-tree";
import { Input, Button, Label } from "../ui";
import ActsDetailsContent, { ActsDetailsData } from "./acts-details-content";

export type ActsDetailsProps = {
  actTitle: string;
  contentSections?: ActsContentTreeSection[];
  activeItem?: string;
  onItemClick?: (sectionTitle: string, item: string) => void;
  actsDetailsData?: ActsDetailsData;

  className?: string;
  onContinueClick?: () => void;
  onVisitIndiaCodeClick?: () => void;
  onVisitIndiaCodeSelect?: () => void;
};

function ActsDetails({
  actTitle,
  contentSections,
  onItemClick,
  actsDetailsData,
  className,
  onContinueClick,
  onVisitIndiaCodeClick,
  onVisitIndiaCodeSelect,
}: ActsDetailsProps) {
  const [activeItem, setActiveItem] = React.useState<string | undefined>();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (_sectionTitle: string, itemId: string) => {
    setActiveItem(itemId);
    const container = contentRef.current;
    const target = document.getElementById(itemId);

    if (!container || !target) return;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;

    container.scrollTo({
      top: container.scrollTop + (targetTop - containerTop),
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    const container = contentRef.current;
    if (!container || !actsDetailsData) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("section[id]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) {
          setActiveItem(visible.target.id);
        }
      },
      {
        root: container,
        threshold: 0.3,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [actsDetailsData]);

  return (
    <div className="h-screen flex">
      <div
        className="flex w-full h-full flex-col overflow-hidden items-start gap-2 p-2
      rounded-modal bg-color-surface-neutral-default"
      >
        <div className="flex flex-col items-start gap-4 flex-1 self-stretch min-h-0">
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
                onClick={onContinueClick}
                className="flex h-8 items-center justify-center gap-2 px-3 py-1.5 
              rounded-button-border-radius-default button-border-weight-default 
              border-color-button-color-neutral-default-stroke bg-color-button-color-neutral-default-bg"
                size="extraSmall"
                suffixIcon="arrow-down-c"
                variant="neutral"
              >
                Continue
              </Button>

              <Icon
                name="add"
                color="neutral"
                className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
              />

              <Icon
                name="at"
                color="neutral"
                className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
              />
              <Icon
                name="save-b"
                color="neutral"
                className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
              />
              <Icon
                name="share-a"
                color="neutral"
                className="flex w-8 h-8 items-center p-2 
              aspect-square rounded-icon_button-border-radius-default"
              />

              <Label
                className="flex h-8 items-center justify-center gap-2 px-3 py-2 
              rounded-label-border-radius-default label-border-weight-default 
              border-color-label-color-neutral-stroke bg-color-label-color-neutral-bg"
                colorScheme="neutral"
                onClick={onVisitIndiaCodeClick}
                onSelect={onVisitIndiaCodeSelect}
                size="medium"
              >
                Visit India Code
              </Label>
            </div>
          </div>

          <hr className="w-full max-w-[1168px] h-[1px] border-color-border-neutral-default" />

          <div className="flex items-stretch gap-2 flex-1 self-stretch overflow-hidden min-h-0">
            {/* Sidebar */}
            {contentSections && (
              <ActsContentTree
                sections={contentSections}
                activeItem={activeItem}
                onItemClick={handleItemClick}
              />
            )}

            {/* Content */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto overscroll-contain min-w-0 overflow-x-hidden"
            >
              {actsDetailsData ? (
                <ActsDetailsContent data={actsDetailsData} />
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActsDetails;
