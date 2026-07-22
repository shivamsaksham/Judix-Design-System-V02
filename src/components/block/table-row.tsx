import React from 'react';
import { cn } from '@/lib/utils';

export interface TableRowColumn {
  content: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  className?: string;
  hasBorder?: boolean;
}

export interface TableRowProps {
  columns: TableRowColumn[];
  isLast?: boolean;
  isHeader?: boolean;
  className?: string;
  gridColsClass?: string;
}

export function TableRow({ columns, isLast, isHeader, className, gridColsClass }: TableRowProps) {
  const gridCols = gridColsClass
    ? gridColsClass
    : columns.length === 2
      ? 'grid-cols-[168px_1fr] md:grid-cols-[200px_1fr]'
      : columns.length === 3
        ? 'grid-cols-[50px_130px_1fr]'
        : `grid-cols-${columns.length}`;

  return (
    <div
      className={cn(
        "grid border-b border-color-border-neutral-default last:border-0",
        gridCols,
        isLast && "border-b-0",
        className
      )}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className={cn(
            "p-2 pr-6 text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default",
            column.hasBorder !== false && index < columns.length - 1 && "border-r border-color-border-neutral-default",
            isHeader && "text-style-textblock-secondary-bodytext-emphasis",
            column.minWidth && column.minWidth,
            column.maxWidth && column.maxWidth,
            column.className
          )}
        >
          <div className="p-1">{column.content}</div>
        </div>
      ))}
    </div>
  );
}

export default TableRow;
