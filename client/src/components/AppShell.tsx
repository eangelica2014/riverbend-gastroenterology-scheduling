/**
 * Clinical Field Notebook design: a slim folio rail orients the evaluator while
 * asymmetric content panels keep evidence and action visible without a generic dashboard grid.
 */

import { Link, useLocation } from "wouter";
import {
  Activity,
  Beaker,
  Blocks,
  FileStack,
  FlaskConical,
  Home,
  Menu,
  Mic2,
  ShieldCheck,
  X,
} from "lucide-react";
import { PropsWithChildren, useState } from "react";

const logoUrl = "/manus-storage/riverbend-logo_d20ad05b.png";

const navItems = [
  { href: "/", label: "Case brief", short: "Brief", icon: Home },
  { href: "/agent", label: "Voice agent", short: "Agent", icon: Mic2 },
  { href: "/architecture", label: "Architecture", short: "System", icon: Blocks },
  { href: "/tests", label: "Scenario lab", short: "Tests", icon: FlaskConical },
  { href: "/platform", label: "FieldFlow", short: "Platform", icon: FileStack },
  { href: "/experiments", label: "Experiments", short: "Evidence", icon: Beaker },
];

export function AppShell({ children }: PropsWithChildren) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only z-[100] bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="mobile-header lg:hidden">
        <Link href="/" className="brand-lockup" onClick={() => setOpen(false)}>
          <img src={logoUrl} alt="" className="h-10 w-10" />
          <span>
            <strong>Riverbend</strong>
            <small>Scheduling system</small>
          </span>
        </Link>
        <button className="icon-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <aside className={`folio-rail ${open ? "folio-rail--open" : ""}`} aria-label="Case study navigation">
        <div className="folio-brand">
          <Link href="/" className="brand-lockup" onClick={() => setOpen(false)}>
            <img src={logoUrl} alt="" className="brand-mark" />
            <span>
              <strong>Riverbend</strong>
              <small>Scheduling system</small>
            </span>
          </Link>
          <div className="folio-index" aria-hidden="true">01—06</div>
        </div>

        <nav className="folio-nav">
          {navItems.map((item, index) => {
            const active = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`folio-link ${active ? "folio-link--active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="folio-number">0{index + 1}</span>
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="folio-footer">
          <div className="status-row">
            <Activity size={15} />
            <span>Inspectable demo</span>
          </div>
          <div className="status-row">
            <ShieldCheck size={15} />
            <span>Synthetic data only</span>
          </div>
          <p>Prepared by Eangelica Aton for Confido Health.</p>
        </div>
      </aside>

      <main id="main-content" className="app-canvas">
        <div className="page-ruler" aria-hidden="true" />
        {children}
      </main>

      <nav className="mobile-tabs lg:hidden" aria-label="Quick navigation">
        {navItems.map((item) => {
          const active = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={active ? "mobile-tab mobile-tab--active" : "mobile-tab"}>
              <Icon size={17} />
              <span>{item.short}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

