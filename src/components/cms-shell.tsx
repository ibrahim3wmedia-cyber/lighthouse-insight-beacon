import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { group: "Algemeen", items: ["Dashboard", "Media", "QA_AUTOMATION_TEST"] },
  { group: "Content", items: ["Template", "Menu", "Pagina"] },
  { group: "Modules", items: ["Accommodaties", "FlipBook", "Golf", "Map", "Menukaart"] },
  { group: "Administratie", items: ["Gebruikers", "Instellingen", "Lighthouse"] },
];

export function Sidebar({ open, active }: { open: boolean; active: string }) {
  return (
    <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-y-auto bg-ink text-ink-foreground transition-all md:flex ${open ? "w-60" : "w-0"}`}>
      <div className="flex h-14 items-center gap-2 px-5 text-lg font-extrabold tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">3W</span>
        media
      </div>
      <nav className="flex-1 space-y-6 px-3 py-4">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest opacity-50">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const isActive = it === active;
                const cls = `flex items-center gap-3 truncate rounded-md px-2 py-1.5 text-sm transition ${isActive ? "bg-primary text-primary-foreground" : "opacity-75 hover:bg-ink-foreground/10 hover:opacity-100"}`;
                const dot = <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-primary-foreground" : "bg-ink-foreground/40"}`} />;
                return (
                  <li key={it}>
                    {it === "Dashboard" ? (
                      <Link to="/dashboard" className={cls}>{dot}{it}</Link>
                    ) : it === "Lighthouse" ? (
                      <Link to="/" className={cls}>{dot}{it}</Link>
                    ) : (
                      <a href="#" className={cls}>{dot}{it}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function Topbar({ onToggle, crumbs }: { onToggle: () => void; crumbs: string[] }) {
  const [lang, setLang] = useState("NL");
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur">
      <button onClick={onToggle} aria-label="Menu" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">☰</button>
      <nav className="flex min-w-0 items-center gap-1.5 truncate text-sm text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1.5">
            {i > 0 && <span>/</span>}
            <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : ""}>{c}</span>
          </span>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground lg:flex">
          ⌕ Ga naar… <kbd className="rounded bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
        </div>
        <div className="hidden rounded-md border p-0.5 text-xs sm:flex">
          {["NL", "EN", "DE", "FR"].map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`rounded px-2 py-1 font-medium ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">IB</span>
      </div>
    </header>
  );
}
