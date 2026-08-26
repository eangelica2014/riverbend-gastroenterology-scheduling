/**
 * Clinical Field Notebook design: editorial headlines pair with precise mono labels
 * and left-aligned field notes to preserve the selected asymmetrical hierarchy.
 */

import { PropsWithChildren } from "react";

const logoUrl = "/manus-storage/riverbend-logo_d20ad05b.png";

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: PropsWithChildren<{ eyebrow: string; title: string; lede: string }>) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{lede}</p>
      </div>
      <div className="page-header__aside">
        <div className="page-ledger-mark">
          <img src={logoUrl} alt="" />
          <span><strong>Riverbend</strong><small>Field binder · product proof</small></span>
        </div>
        {children}
      </div>
    </header>
  );
}
