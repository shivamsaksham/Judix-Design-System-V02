import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";

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

const Row = ({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) => (
  <div className={cn("grid grid-cols-[auto_1fr] border-b border-color-border-neutral-default last:border-0", isLast && "border-b-0")}>
    <div className={cn("border-r border-color-border-neutral-default pl-2 pt-2 pb-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-[205px]")}>
      <div className="p-1">{label}</div>    
    </div>
    <div className={cn("p-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-[437px]")}>
      <div className="p-1">{value}</div>
    </div>
  </div>
);

export function CitationData({ data, className }: CitationDataProps) {
  return (
    <div className={cn("w-full max-w-4xl bg-color-surface-neutral-default p-2", className)}>
      
      <Card className="rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0">
        <CardContent>
          <Row label="S.C.R. Citation" value={data.scrCitation}/>
          <Row label="Year/Volume" value={data.yearVolume} />
          <Row label="Neutral Citation" value={data.neutralCitation} />
          <Row label="Number of cases cited" value={data.numberOfCasesCited} isLast />
        </CardContent>
      </Card>
    </div>
  );
}

export default CitationData;
