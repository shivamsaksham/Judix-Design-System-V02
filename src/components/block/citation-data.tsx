import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { TableRow } from './table-row';

export interface CitationMetadata {
  scrCitation: string;
  yearVolume: string;
  neutralCitation: string;
  numberOfCasesCited: string;
}

export interface CitationDataProps {
  data: CitationMetadata;
  className?: string;
}

export function CitationData({ data, className }: CitationDataProps) {
  const rows = [
    { label: "S.C.R. Citation", value: data.scrCitation },
    { label: "Year/Volume", value: data.yearVolume },
    { label: "Neutral Citation", value: data.neutralCitation },
    { label: "Number of cases cited", value: data.numberOfCasesCited }
  ];

  return (
    <Card className={cn("rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0 w-full", className)}>
      <CardContent>
        {rows.map((row, index) => (
          <TableRow
            key={index}
            columns={[
              { content: row.label, minWidth: "min-w-[205px]" },
              { content: row.value, minWidth: "min-w-[437px]" }
            ]}
            isLast={index === rows.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default CitationData;
