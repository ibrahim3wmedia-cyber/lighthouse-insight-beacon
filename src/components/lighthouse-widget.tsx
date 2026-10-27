import { Link } from "@tanstack/react-router";
import { useState } from "react";

type Device = "desktop" | "mobile";
const BASE: Record<Device, { label: string; score: number }[]> = {
  desktop: [
    { label: "Prestaties", score: 67 },
    { label: "Toegankelijkheid", score: 96 },
    { label: "Werkwijzen", score: 96 },
    { label: "SEO", score: 54 },
  ],
  mobile: [
    { label: "Prestaties", score: 41 },
    { label: "Toegankelijkheid", score: 93 },
    { label: "Werkwijzen", score: 92 },
    { label: "SEO", score: 54 },
  ],
};

const tone = (s: number) => (s >= 90 ? "text-good" : s >= 50 ? "text-average" : "text-poor");
const ring = (s: number) => (s >= 90 ? "bg-good" : s >= 50 ? "bg-average" : "bg-poor");

function Mini({ score }: { score: number }) {
  const r = 16, c = 2 * Math.PI * r;
  return (
    <svg width="44" height="44" viewBox="0 0 40 40" className={tone(score)}>
      <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="4" />
      <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 20 20)"
        style={{ transition: "stroke-dashoffset .8s ease" }} />
      <text x="20" y="20" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="12" fontWeight="800">{score}</text>
    </svg>
  );
}

export function LighthouseWidget() {
  const [device, setDevice] = useState<Device>("desktop");
  const [data, setData] = useState(BASE);
  const [checked, setChecked] = useState<Record<Device, Date>>(() => ({ desktop: new Date(), mobile: new Date() }));
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData((d) => ({
        ...d,
        [device]: BASE[device].map((m) => ({ ...m, score: Math.max(0, Math.min(100, m.score + Math.round(Math.random() * 8 - 4))) })),
      }));
      setChecked((c) => ({ ...c, [device]: new Date() }));
      setLoading(false);
    }, 1500);
  };

  const items = data[device];
  const avg = Math.round(items.reduce((a, b) => a + b.score, 0) / items.length);

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${ring(avg)}`} />
          <h3 className="text-sm font-bold">Lighthouse</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md bg-muted p-0.5 text-xs">
            {(["desktop", "mobile"] as const).map((d) => (
              <button key={d} onClick={() => setDevice(d)} disabled={loading}
                className={`rounded px-2.5 py-1 font-medium transition ${device === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {d === "desktop" ? "Desktop" : "Mobiel"}
              </button>
            ))}
          </div>
          <button onClick={refresh} disabled={loading} aria-label="Vernieuwen" title="Vernieuwen"
            className="flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60">
            <span className={loading ? "inline-block animate-spin" : ""}>↻</span>
          </button>
        </div>
      </div>
      <div className={`grid grid-cols-4 gap-2 p-4 transition ${loading ? "opacity-40" : ""}`}>
        {items.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-1 text-center">
            <Mini score={m.score} />
            <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
        <span>{loading ? "Bezig met controleren…" : `Laatst: ${checked[device].toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}`}</span>
        <Link to="/" className="font-semibold text-primary hover:underline">Volledig rapport →</Link>
      </div>
    </div>
  );
}
