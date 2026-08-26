/**
 * Clinical Field Notebook design: even an error state provides orientation, evidence,
 * and one concrete way back into the case study.
 */

import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="page-shell not-found-page">
      <span className="eyebrow">404 · Route not found</span>
      <h1>This page is outside the approved workflow.</h1>
      <p>No record or configuration was changed. Return to the case brief to continue.</p>
      <Link href="/" className="button-primary"><ArrowLeft size={17} /> Return to case brief</Link>
    </div>
  );
}

