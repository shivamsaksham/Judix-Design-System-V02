import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import ActsTable from "@/components/block/acts-table";
import CaseMetadataTable from "@/components/block/case-metadata-table";
import CasesCited from "@/components/block/cases-cited";
import CitationData from "@/components/block/citation-data";
import { Label } from "@/components/ui/label";

export interface JudgmentData {
  overallSummary: string;
  issue: string;
  facts: string;
  arguments: string;
  reasoning: string;
  decision: string;
  actsTable?: any;
  caseMetadata?: any;
  citationData?: any;
  casesCited?: any;
  keywords?: string[];
}

/* ---------- GENERIC SECTION ---------- */
const Section = ({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) => (
  <section
    id={id}
    className="flex flex-col gap-2 mb-8 scroll-mt-6"
  >
    <div className="border-b border-color-border-neutral-default pt-2 pb-2 pl-1">
      <div className="text-style-body-default-emphasis text-color-text-neutral-secondary">
        {title}
      </div>
    </div>

    <div className="p-1">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </section>
);

/* ---------- TABLE SECTION ---------- */
const TableSection = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="flex flex-col gap-2 mb-8 scroll-mt-6"
  >
    <div className="border-b border-color-border-neutral-default pt-2 pb-2 pl-1">
      <div className="text-style-body-default-emphasis text-color-text-neutral-secondary">
        {title}
      </div>
    </div>
    {children}
  </section>
);

export function JudgmentDetailsContent({ data }: { data: JudgmentData }) {
  return (
    <Card className="rounded-none border-none shadow-none bg-transparent">
      <CardContent>

        <Section id="overall-summary" title="OVERALL SUMMARY" content={data.overallSummary} />
        <Section id="issue" title="ISSUE" content={data.issue} />
        <Section id="facts" title="FACTS" content={data.facts} />
        <Section id="arguments" title="ARGUMENTS" content={data.arguments} />
        <Section id="reasoning" title="REASONING" content={data.reasoning} />
        <Section id="decision" title="DECISION" content={data.decision} />

        {data.caseMetadata && (
          <TableSection id="metadata" title="CASE METADATA">
            <CaseMetadataTable data={data.caseMetadata} />
          </TableSection>
        )}

        {data.actsTable && (
          <TableSection id="acts-sections" title="ACTS & SECTIONS">
            <ActsTable {...data.actsTable} />
          </TableSection>
        )}

        {data.keywords && (
          <section id="keywords" className="mb-8 scroll-mt-6">
            <div className="border-b mb-2">KEYWORDS</div>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((k) => (
                <Label key={k}>{k}</Label>
              ))}
            </div>
          </section>
        )}

        {data.citationData && (
          <TableSection id="citation-metadata" title="CITATION METADATA">
            <CitationData data={data.citationData} />
          </TableSection>
        )}

        {data.casesCited && (
          <TableSection id="cases-cited" title="CASES CITED">
            <CasesCited {...data.casesCited} />
          </TableSection>
        )}
      </CardContent>
    </Card>
  );
}

export default JudgmentDetailsContent;
