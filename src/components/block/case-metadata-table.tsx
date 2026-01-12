import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";

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

const Row = ({ label,value,isLast }: { label: string; value: string; isLast?: boolean }) => (
  <div className={cn("grid grid-cols-[auto_1fr] border-b border-color-border-neutral-default last:border-0", isLast && "border-b-0")}>
    <div className={cn("border-r border-color-border-neutral-default pl-2 pt-2 pb-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-42")}>
      <div className="p-1">{label}</div>
    </div>
    <div className={cn("p-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-[802px]")}>
      <div className="p-1">{value}</div>
    </div>
  </div>
);

export function CaseMetadataTable({ data, className }: CaseMetadataTableProps) {
  return (
    <div className={cn("w-full max-w-4xl bg-color-surface-neutral-default p-2", className)}>
      
      <Card className="rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0">
        <CardContent>
          <Row label="Domain" value={data.domain}/>
          <Row label="Case type" value={data.caseType} />
          <Row label="Case No." value={data.caseNo} />
          <Row label="Date of judgment" value={data.dateOfJudgment} />
          <Row label="Court" value={data.court} />
          <Row label="Disposal Nature" value={data.disposalNature} />
          <Row label="Judges" value={data.judges} isLast />
        </CardContent>
      </Card>
    </div>
  );
}

export default CaseMetadataTable;
