import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { TableRow } from './table-row';

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

export function CasesCited({ data, headers, className }: CasesCitedProps) {
  return (
    <Card className={cn("rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0 w-full", className)}>
      <CardContent>
        <TableRow 
          columns={[
            { content: headers.citationNumber, minWidth: "min-w-50" },
            { content: headers.judicialConsideration, minWidth: "min-w-60" },
            { content: headers.caseLaw, maxWidth: "max-w-[310px]", className: "pr-6 overflow-hidden" }
          ]}
          isHeader 
        />
        {data.map((item, index) => (
          <TableRow 
            key={index}
            columns={[
              { content: item.citationNumber, minWidth: "min-w-50" },
              { content: item.judicialConsideration, minWidth: "min-w-60" },
              { 
                content: <div className="truncate">{item.caseLaw}</div>, 
                maxWidth: "max-w-[310px]", 
                className: "pr-6 overflow-hidden" 
              }
            ]}
            isLast={index === data.length - 1} 
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default CasesCited;
