import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { TableRow } from './table-row';

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

export function ActsTable({ data, headers, className }: ActsTableProps) {
  return (
    <Card className={cn("rounded-none border border-color-border-neutral-default bg-color-surface-neutral-default shadow-none p-0 w-full", className)}>
      <CardContent>
        <TableRow 
          columns={[
            { content: headers.act, minWidth: "min-w-64" },
            { content: headers.details, minWidth: "min-w-[386px]" }
          ]}
          isHeader 
        />
        {data.map((item, index) => (
          <TableRow 
            key={index}
            columns={[
              { content: item.act, minWidth: "min-w-64" },
              { content: item.details, minWidth: "min-w-[386px]" }
            ]}
            isLast={index === data.length - 1} 
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default ActsTable;
