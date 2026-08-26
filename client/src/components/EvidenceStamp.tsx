/**
 * Clinical Field Notebook design: rectangular evidence stamps make runtime state
 * look reviewed and operational—not decorative or gamified.
 */

import { PropsWithChildren } from "react";

export function EvidenceStamp({ tone = "verified", children }: PropsWithChildren<{ tone?: "verified" | "attention" | "blocked" | "neutral" }>) {
  return <span className={`evidence-stamp evidence-stamp--${tone}`}>{children}</span>;
}

export function RuleRibbon({ id, children }: PropsWithChildren<{ id: string }>) {
  return (
    <div className="rule-ribbon">
      <span>{id}</span>
      <p>{children}</p>
    </div>
  );
}

