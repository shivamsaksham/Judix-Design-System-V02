import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import ActsTable, { ActData } from '@/components/block/acts-table';
import CaseMetadataTable, { CaseMetadata } from '@/components/block/case-metadata-table';
import CasesCited, { CaseCitedData } from '@/components/block/cases-cited';
import CitationData, { CitationMetadata } from '@/components/block/citation-data';
import { Label } from '@/components/ui/label';

export interface JudgmentData {
  overallSummary: string;
  issue: string;
  facts: string;
  arguments: string;
  reasoning: string;
  decision: string;
  actsTable?: {
    data: ActData[];
    headers: { act: string; details: string };
  };
  caseMetadata?: CaseMetadata;
  casesCited?: {
    data: CaseCitedData[];
    headers: { citationNumber: string; judicialConsideration: string; caseLaw: string };
  };
  citationData?: CitationMetadata;
  keywords?: string[];
}

export interface JudgmentDetailsContentProps {
  data: JudgmentData;
  className?: string;
}


const Section = ({ title, content}: { title: string; content: string; }) => (
  <div className={cn("min-w-[986px] flex flex-col gap-2")}>
    <div className = {cn("border-b border-color-border-neutral-default pt-2 pb-2 pl-1")}>
        <div className='text-style-body-default-emphasis text-color-text-neutral-secondary'>
            {title}
        </div>
    </div>
    <div className = "p-1 mb-4">
        <div className={cn(
            "text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default"
            )}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    </div>
  </div>
);

const TableSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={cn("min-w-[986px] flex flex-col gap-2 mb-4")}>
    <div className = {cn("border-b border-color-border-neutral-default pt-2 pb-2 pl-1")}>
        <div className='text-style-body-default-emphasis text-color-text-neutral-secondary'>
            {title}
        </div>
    </div>
    <div className = "p-2">
      <div>
          {children}
      </div>
    </div>
  </div>
);

const KeyWord = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={cn("min-w-[986px] flex flex-col gap-2 mb-4")}>
    <div className = {cn("border-b border-color-border-neutral-default pt-2 pb-2 pl-1")}>
        <div className='text-style-body-default-emphasis text-color-text-neutral-secondary'>
            {title}
        </div>
    </div>
    <div>
      {children}
    </div>
  </div>
);

export function JudgmentDetailsContent({ data, className }: JudgmentDetailsContentProps) {
  return (
    <Card className="rounded-none border-none shadow-none bg-transparent">
        <CardContent>
          <Section title="OVERALL SUMMARY" content={data.overallSummary}/>
          <Section title="ISSUE" content={data.issue} />
          <Section title="FACTS" content={data.facts} />
          <Section title="ARGUMENTS" content={data.arguments} />
          <Section title="REASONING" content={data.reasoning} />
          <Section title="DECISION" content={data.decision} />
          
          {data.caseMetadata && (
            <TableSection title="CASE METADATA">
              <div className="[&>div]:!max-w-none [&>div]:!p-0 [&_[class*='grid-cols-']]:!grid-cols-[auto_1fr] [&_[class*='grid-cols-']>div:last-child]:!min-w-0">
                <CaseMetadataTable data={data.caseMetadata} />
              </div>
            </TableSection>
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
          
          {data.keywords && data.keywords.length > 0 && (
            <KeyWord title="KEYWORDS">
              <div className="flex flex-wrap gap-2">
                {data.keywords.map((keyword, index) => (
                  <Label
                    key={index}
                    colorScheme="neutral"
                    size="medium"
                  >
                    {keyword}
                  </Label>
                ))}
              </div>
            </KeyWord>
          )}
          
          {data.citationData && (
            <TableSection title="CITATION METADATA">
              <div className="[&>div]:!max-w-none [&>div]:!p-0 [&_[class*='grid-cols-']]:!grid-cols-[auto_1fr] [&_[class*='grid-cols-']>div:last-child]:!min-w-0">
                <CitationData data={data.citationData}/>
              </div>
            </TableSection>
          )}        
          
          {data.casesCited && (
            <TableSection title="CASE CITED">
              <div className="[&>div]:!max-w-none [&>div]:!p-0 [&_[class*='grid-cols-']]:!grid-cols-[auto_auto_1fr] [&_[class*='grid-cols-']>div:last-child]:!min-w-0 [&_[class*='grid-cols-']>div:last-child]:!max-w-none [&_.truncate]:!overflow-visible [&_.truncate]:!whitespace-normal [&_.truncate]:!text-clip">
                <CasesCited 
                  data={data.casesCited.data} 
                  headers={data.casesCited.headers}
                />
              </div>
            </TableSection>
          )}
        </CardContent>
    </Card>
  );
}

export default JudgmentDetailsContent;
