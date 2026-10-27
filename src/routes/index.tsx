import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lighthouse analyse — 3W Media CMS" },
      { name: "description", content: "Test de startpagina op prestaties, toegankelijkheid, best practices en SEO." },
      { property: "og:title", content: "Lighthouse analyse — 3W Media CMS" },
      { property: "og:description", content: "Test de startpagina op prestaties, toegankelijkheid, best practices en SEO." },
    ],
  }),
  component: LighthousePage,
});

type Audit = { score: number; title: string; detail?: string; desc: string };

const SCORES = [
  { key: "perf", label: "Prestaties", score: 67 },
  { key: "a11y", label: "Toegankelijkheid", score: 96 },
  { key: "bp", label: "Aanbevolen werkwijzen", score: 96 },
  { key: "seo", label: "SEO", score: 54 },
];

const METRICS = [
  { label: "First Contentful Paint", value: "1.3 s", score: 71 },
  { label: "Largest Contentful Paint", value: "1.3 s", score: 87 },
  { label: "Total Blocking Time", value: "0 ms", score: 100 },
  { label: "Cumulative Layout Shift", value: "1.016", score: 2 },
  { label: "Speed Index", value: "1.6 s", score: 77 },
  { label: "Time to Interactive", value: "1.3 s", score: 95 },
];

const AUDITS: Record<string, Audit[]> = {
  Prestaties: [
    { score: 0, title: "Layout shift culprits", desc: "Layout shifts occur when elements move absent any user interaction." },
    { score: 0, title: "Document request latency", detail: "Est savings of 1,300 ms", desc: "Reduce latency by avoiding redirects, ensuring a fast server response, and enabling text compression." },
    { score: 0, title: "Network dependency tree", desc: "Avoid chaining critical requests by reducing chain length and deferring resources." },
    { score: 0, title: "Render-blocking requests", detail: "Est savings of 40 ms", desc: "Requests are blocking the page's initial render, which may delay LCP." },
    { score: 0, title: "Reduce unused CSS", detail: "Est savings of 58 KiB", desc: "Reduce unused rules from stylesheets and defer CSS not used for above-the-fold content." },
    { score: 0, title: "Page prevented back/forward cache restoration", detail: "2 failure reasons", desc: "The bfcache can speed up return navigations." },
    { score: 0, title: "Avoid multiple page redirects", detail: "Est savings of 670 ms", desc: "Redirects introduce additional delays before the page can be loaded." },
    { score: 0, title: "Reduce initial server response time", detail: "Root document took 920 ms", desc: "Keep the server response time for the main document short." },
    { score: 0, title: "Avoid large layout shifts", detail: "8 layout shifts found", desc: "These are the largest layout shifts observed on the page." },
    { score: 2, title: "Cumulative Layout Shift", detail: "1.016", desc: "Measures the movement of visible elements within the viewport." },
    { score: 50, title: "Use efficient cache lifetimes", detail: "Est savings of 499 KiB", desc: "A long cache lifetime can speed up repeat visits to your page." },
    { score: 50, title: "Minify JavaScript", detail: "Est savings of 3 KiB", desc: "Minifying JavaScript files can reduce payload sizes and script parse time." },
    { score: 50, title: "Reduce unused JavaScript", detail: "Est savings of 200 KiB", desc: "Defer loading scripts until they are required." },
    { score: 50, title: "Image elements do not have explicit width and height", desc: "Set explicit width and height on images to reduce layout shifts." },
    { score: 71, title: "First Contentful Paint", detail: "1.3 s", desc: "Marks the time at which the first text or image is painted." },
    { score: 77, title: "Speed Index", detail: "1.6 s", desc: "Shows how quickly the contents of a page are visibly populated." },
    { score: 87, title: "Largest Contentful Paint", detail: "1.3 s", desc: "Marks the time at which the largest text or image is painted." },
  ],
  Toegankelijkheid: [
    { score: 0, title: "Background and foreground colors do not have a sufficient contrast ratio", desc: "Low-contrast text is difficult or impossible for many users to read." },
    { score: 0, title: "Heading elements are not in a sequentially-descending order", desc: "Properly ordered headings convey the semantic structure of the page." },
  ],
  "Aanbevolen werkwijzen": [
    { score: 0, title: "Browser errors were logged to the console", desc: "Errors logged to the console indicate unresolved problems." },
  ],
  SEO: [
    { score: 0, title: "Page is blocked from indexing", desc: "Search engines are unable to include your pages in search results." },
    { score: 0, title: "Document does not have a meta description", desc: "Meta descriptions may be included in search results to summarize page content." },
    { score: 0, title: "Links are not crawlable", desc: "Ensure the href attribute of anchor elements links to an appropriate destination." },
  ],
};

const tone = (s: number) => (s >= 90 ? "good" : s >= 50 ? "average" : "poor");
const toneText = { good: "text-good", average: "text-average", poor: "text-poor" };
const toneBg = { good: "bg-good", average: "bg-average", poor: "bg-poor" };

function Gauge({ score, size = 96 }: { score: number; size?: number }) {
  const r = 42, c = 2 * Math.PI * r;
  const t = tone(score);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={toneText[t]}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="26" fontWeight="800">{score}</text>
    </svg>
  );
}

function LighthousePage() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [tab, setTab] = useState("Prestaties");
  const [onlyFailed, setOnlyFailed] = useState(false);

  const run = () => {
    setState("running");
    setTimeout(() => setState("done"), 2200);
  };

  const audits = (AUDITS[tab] ?? []).filter((a) => !onlyFailed || a.score < 50);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Administratie</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Lighthouse</h1>

        {/* Run panel */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-ink text-ink-foreground shadow-xl">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <h2 className="text-xl font-bold">Controleer de startpagina</h2>
              <p className="mt-2 text-sm opacity-70">
                Meet prestaties, toegankelijkheid, aanbevolen werkwijzen en SEO. Alleen de startpagina van de standaardwebsite wordt gecontroleerd.
              </p>
              <code className="mt-4 inline-block rounded-md bg-ink-foreground/10 px-3 py-1.5 font-mono text-xs">https://3wdev.php83.cms</code>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <div className="inline-flex rounded-lg bg-ink-foreground/10 p-1 text-sm">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button key={d} onClick={() => setDevice(d)}
                    className={`rounded-md px-4 py-1.5 font-medium transition ${device === d ? "bg-ink-foreground text-ink" : "opacity-70 hover:opacity-100"}`}>
                    {d === "desktop" ? "Desktop" : "Mobiel"}
                  </button>
                ))}
              </div>
              <button onClick={run} disabled={state === "running"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition hover:brightness-110 disabled:opacity-60">
                {state === "running" && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
                {state === "running" ? "Bezig met analyseren…" : state === "done" ? "Opnieuw controleren" : "Start analyse"}
              </button>
            </div>
          </div>
          {state === "running" && <div className="h-1 w-full animate-pulse bg-primary" />}
        </section>

        {state === "idle" && (
          <div className="mt-8 rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
            Nog geen resultaten. Start een analyse om de scores te bekijken.
          </div>
        )}

        {state === "running" && (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SCORES.map((s) => <div key={s.key} className="h-44 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        )}

        {state === "done" && (
          <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Gecontroleerd: <span className="font-mono text-foreground">https://www.3wdev.php83.cms/</span></span>
              <span>{device === "desktop" ? "Desktop" : "Mobiel"} · zojuist</span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {SCORES.map((s) => (
                <button key={s.key} onClick={() => setTab(s.label)}
                  className={`flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 transition hover:shadow-md ${tab === s.label ? "ring-2 ring-primary" : ""}`}>
                  <Gauge score={s.score} />
                  <span className="text-sm font-semibold">{s.label}</span>
                </button>
              ))}
            </div>

            <section>
              <h3 className="mb-3 text-lg font-bold">Metrieken</h3>
              <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {METRICS.map((m) => {
                  const t = tone(m.score);
                  return (
                    <div key={m.label} className="flex items-start gap-3 bg-card p-5">
                      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${toneBg[t]}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className={`mt-1 text-2xl font-bold ${toneText[t]}`}>{m.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                <div className="flex flex-wrap gap-1">
                  {Object.keys(AUDITS).map((k) => (
                    <button key={k} onClick={() => setTab(k)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                      {k} <span className="ml-1 opacity-70">{AUDITS[k]?.length ?? 0}</span>
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" checked={onlyFailed} onChange={(e) => setOnlyFailed(e.target.checked)} className="accent-primary" />
                  Alleen kritieke
                </label>
              </div>
              <ul className="divide-y">
                {audits.map((a) => {
                  const t = tone(a.score);
                  return (
                    <li key={a.title}>
                      <details className="group px-5 py-4">
                        <summary className="flex cursor-pointer list-none items-center gap-4">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground ${toneBg[t]}`}>{a.score}</span>
                          <span className="flex-1 font-medium">{a.title}</span>
                          {a.detail && <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{a.detail}</span>}
                          <span className="text-muted-foreground transition group-open:rotate-90">›</span>
                        </summary>
                        <p className="mt-2 pl-13 text-sm text-muted-foreground">{a.desc}</p>
                      </details>
                    </li>
                  );
                })}
                {audits.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Geen kritieke audits.</li>}
              </ul>
            </section>

            <section className="flex items-center justify-between rounded-2xl border bg-card p-5">
              <div>
                <h3 className="font-bold">Volledig rapport</h3>
                <p className="text-sm text-muted-foreground">Bekijk het originele Lighthouse-rapport met alle details.</p>
              </div>
              <button className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-muted">Rapport openen ↗</button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
