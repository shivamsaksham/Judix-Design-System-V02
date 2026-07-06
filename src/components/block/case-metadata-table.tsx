import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { TableRow } from './table-row';

export interface CaseMetadata {
  domain: string;
  caseType: string;
  caseNo: string;
  dateOfJudgment: string;
  court: string;
  disposalNature: string;
  judges: string;
}

export interface CaseMetadataTableProps {
  data: CaseMetadata;
  className?: string;
}

export function CaseMetadataTable({ data, className }: CaseMetadataTableProps) {
  const rows = [
    { label: "Domain", value: data.domain },
    { label: "Case type", value: data.caseType },
    { label: "Case No.", value: data.caseNo },
    { label: "Date of judgment", value: data.dateOfJudgment },
    { label: "Court", value: data.court },
    { label: "Disposal Nature", value: data.disposalNature },
    { label: "Judges", value: data.judges }
  ];

  return (
    <Card className={cn("m-2 rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0 w-full", className)}>
      <CardContent>
        {rows.map((row, index) => (
          <TableRow
            key={index}
            columns={[
              { content: row.label, minWidth: "min-w-42" },
              { content: row.value, minWidth: "min-w-[150px]", className: "whitespace-normal break-words" }
            ]}
            isLast={index === rows.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default CaseMetadataTable;
