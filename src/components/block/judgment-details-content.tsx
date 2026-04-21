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


const JudgmentSection = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
  <div id={id || title.toLowerCase().replace(/\s+/g, '-')} className="w-full flex flex-col gap-2 mb-4">
    <div className="border-b border-color-border-neutral-default pt-2 pb-2 pl-1">
      <div className="text-style-body-default-emphasis text-color-text-neutral-secondary uppercase">
        {title}
      </div>
    </div>
    <div className="p-1">
      {children}
    </div>
  </div>
);

export function JudgmentDetailsContent({ data, className }: JudgmentDetailsContentProps) {
  const textSections = [
    { title: "OVERALL SUMMARY", content: data.overallSummary },
    { title: "ISSUE", content: data.issue },
    { title: "FACTS", content: data.facts },
    { title: "ARGUMENTS", content: data.arguments },
    { title: "REASONING", content: data.reasoning },
    { title: "DECISION", content: data.decision },
  ];

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {textSections.map((section) => (
        <JudgmentSection key={section.title} title={section.title}>
          <div className="text-style-textblock-secondary-bodytext-regular text-color-text-neutral-default">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </JudgmentSection>
      ))}

      {data.caseMetadata && (
        <JudgmentSection title="CASE METADATA">
          <CaseMetadataTable data={data.caseMetadata} />
        </JudgmentSection>
      )}

      {data.actsTable && (
        <JudgmentSection title="ACTS & SECTION">
          <ActsTable
            data={data.actsTable.data}
            headers={data.actsTable.headers}
          />
        </JudgmentSection>
      )}

      {data.keywords && data.keywords.length > 0 && (
        <JudgmentSection title="KEYWORDS">
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
        </JudgmentSection>
      )}

      {data.citationData && (
        <JudgmentSection title="CITATION METADATA">
          <CitationData data={data.citationData} />
        </JudgmentSection>
      )}

      {data.casesCited && (
        <JudgmentSection title="CASE CITED">
          <CasesCited
            data={data.casesCited.data}
            headers={data.casesCited.headers}
          />
        </JudgmentSection>
      )}
    </div>
  );
}

export default JudgmentDetailsContent;
