import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar, Topbar } from "@/components/cms-shell";
import { LighthouseWidget } from "@/components/lighthouse-widget";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — 3W Media CMS" },
      { name: "description", content: "Overzicht van je website met de Lighthouse-scores per apparaat." },
      { property: "og:title", content: "Dashboard — 3W Media CMS" },
      { property: "og:description", content: "Overzicht van je website met de Lighthouse-scores per apparaat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [navOpen, setNavOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <Sidebar open={navOpen} active="Dashboard" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggle={() => setNavOpen((v) => !v)} crumbs={["Dashboard"]} />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welkom terug, Ibrahim.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <LighthouseWidget />
          </div>
        </main>
      </div>
    </div>
  );
}
