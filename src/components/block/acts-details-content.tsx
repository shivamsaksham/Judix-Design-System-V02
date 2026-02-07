import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import ActsTable, { ActData } from "@/components/block/acts-table";

export interface ActsDetailsData {
  overview: string;
  applicability?: string;
  definitions?: string;
  provisions?: string;
  penalties?: string;
  actsTable?: {
    data: ActData[];
    headers: { act: string; details: string };
  };
}

export interface ActsDetailsContentProps {
  data: ActsDetailsData;
  className?: string;
}

const Section = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <div className={cn("min-w-[986px] flex flex-col gap-2")}>
    <div className="border-b border-color-border-neutral-default pt-2 pb-2 pl-1">
      <div className="text-style-body-default-emphasis text-color-text-neutral-secondary">
        {title}
      </div>
    </div>

    <div className="p-1 mb-4">
      <div className="text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  </div>
);

/* ---------- Table Section (MATCHES JudgmentDetailsContent) ---------- */
const TableSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className={cn("min-w-[986px] flex flex-col gap-2 mb-4")}>
    <div className="border-b border-color-border-neutral-default pt-2 pb-2 pl-1">
      <div className="flex-1 line-clamp-1 overflow-hidden text-ellipsis text-color-color-text-neutral-secondary text-style-body-default-emphasis">
        {title}
      </div>
    </div>

    <div className="flex-1 text-color-text-neutral-default text-style-textblock-secondary-bodytext-regular">
      <div>{children}</div>
    </div>
  </div>
);

export function ActsDetailsContent({
  data,
  className,
}: ActsDetailsContentProps) {
  return (
    <Card className="rounded-none border-none shadow-none bg-transparent">
      <CardContent>
        <Section title="OVERVIEW" content={data.overview} />

        {data.applicability && (
          <Section title="APPLICABILITY" content={data.applicability} />
        )}

        {data.definitions && (
          <Section title="DEFINITIONS" content={data.definitions} />
        )}

        {data.provisions && (
          <Section title="KEY PROVISIONS" content={data.provisions} />
        )}

        {data.penalties && (
          <Section title="PENALTIES" content={data.penalties} />
        )}

        {data.actsTable && (
          <TableSection title="ACTS & SECTION">
            <div className="[&>div]:!max-w-none [&>div]:!p-0 [&_[class*='grid-cols-']]:!grid-cols-[auto_1fr] [&_[class*='grid-cols-']>div:last-child]:!min-w-0">
              <ActsTable
                data={data.actsTable.data}
                headers={data.actsTable.headers}
              />
            </div>
          </TableSection>
        )}
      </CardContent>
    </Card>
  );
}

export default ActsDetailsContent;
