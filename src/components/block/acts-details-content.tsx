import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export interface ActsSection {
  id: string;
  title: string;
  content: string;
}

export interface ActsDetailsData {
  sections: ActsSection[];
}

export interface ActsDetailsContentProps {
  data: ActsDetailsData;
}

export function ActsDetailsContent({ data }: ActsDetailsContentProps) {
  return (
    <Card className="rounded-none border-none shadow-none bg-transparent">
      <CardContent>
        {data.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="min-w-[986px] flex flex-col gap-2 mb-8 scroll-mt-4"
          >
            {/* Section title */}
            <div className="border-b border-color-border-neutral-default pt-2 pb-2 pl-1">
              <div className="text-style-body-default-emphasis text-color-text-neutral-secondary">
                {section.title}
              </div>
            </div>

            {/* Section content */}
            <div className="p-1">
              <div className="text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

export default ActsDetailsContent;
