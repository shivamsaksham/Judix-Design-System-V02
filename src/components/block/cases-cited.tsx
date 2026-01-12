import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";

export interface CaseCitedData {
  citationNumber: string;
  judicialConsideration: string;
  caseLaw: string;
}

export interface CasesCitedProps {
  data: CaseCitedData[];
  headers: {
    citationNumber: string;
    judicialConsideration: string;
    caseLaw: string;
  };
  className?: string;
}

const Row = ({ 
  citationNumber, 
  judicialConsideration, 
  caseLaw, 
  isLast, 
  isHeader 
}: { 
  citationNumber: React.ReactNode; 
  judicialConsideration: React.ReactNode; 
  caseLaw: React.ReactNode; 
  isLast?: boolean; 
  isHeader?: boolean 
}) => (
  <div className={cn("grid grid-cols-[auto_auto_1fr] border-b border-color-border-neutral-default last:border-0", isLast && "border-b-0")}>
    <div className={cn("border-r border-color-border-neutral-default pl-2 pt-2 pb-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-50", isHeader && "text-style-textblock-secondary-bodytext-emphasis")}>
      <div className="p-1">{citationNumber}</div>
    </div>
    <div className={cn("border-r border-color-border-neutral-default pl-2 pt-2 pb-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-60", isHeader && "text-style-textblock-secondary-bodytext-emphasis")}>
      <div className="p-1">{judicialConsideration}</div>
    </div>
    <div className={cn("p-2 pr-6 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default max-w-[310px] overflow-hidden", isHeader && "text-style-textblock-secondary-bodytext-emphasis")}>
      <div className="p-1 truncate">{caseLaw}</div>
    </div>
  </div>
);

export function CasesCited({ data, headers, className }: CasesCitedProps) {
  return (
    <div className={cn("w-full max-w-4xl bg-color-surface-neutral-default p-2", className)}>
      <Card className="rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0">
        <CardContent>
          <Row 
            citationNumber={headers.citationNumber} 
            judicialConsideration={headers.judicialConsideration} 
            caseLaw={headers.caseLaw} 
            isHeader 
          />
          {data.map((item, index) => (
            <Row 
              key={index} 
              citationNumber={item.citationNumber} 
              judicialConsideration={item.judicialConsideration} 
              caseLaw={item.caseLaw} 
              isLast={index === data.length - 1} 
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default CasesCited;
