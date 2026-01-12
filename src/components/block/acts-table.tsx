import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";

export interface ActData {
  act: string;
  details: string;
}

export interface ActsTableProps {
  data: ActData[];
  headers: {
    act: string;
    details: string;
  };
  className?: string;
}

const Row = ({ act, details, isLast, isHeader }: { act: React.ReactNode; details: React.ReactNode; isLast?: boolean; isHeader?: boolean }) => (
  <div className={cn("grid grid-cols-[auto_1fr] border-b border-color-border-neutral-default last:border-0", isLast && "border-b-0")}>
    <div className={cn("border-r border-color-border-neutral-default pl-2 pt-2 pb-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-64", isHeader && "text-style-textblock-secondary-bodytext-emphasis")}>
      <div className="p-1">{act}</div>
    </div>
    <div className={cn("p-2 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default min-w-[386px]", isHeader && "text-style-textblock-secondary-bodytext-emphasis")}>
      <div className="p-1">{details}</div>
    </div>
  </div>
);

export function ActsTable({ data, headers, className }: ActsTableProps) {
  return (
    <div className={cn("w-full max-w-4xl bg-color-surface-neutral-default p-2", className)}>
      <Card className="rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0">
        <CardContent>
          <Row act={headers.act} details={headers.details} isHeader />
          {data.map((item, index) => (
            <Row 
              key={index} 
              act={item.act} 
              details={item.details} 
              isLast={index === data.length - 1} 
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default ActsTable;
