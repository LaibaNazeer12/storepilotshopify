import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign, ShoppingBag, Receipt, Users, TrendingUp, Lightbulb, ArrowRight, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { demoRecommendations, demoStore } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — StorePilot AI" },
      { name: "description", content: "Revenue, orders, top products and AI recommendations for your Shopify store." },
      { property: "og:title", content: "Dashboard — StorePilot AI" },
      { property: "og:description", content: "Revenue, orders, top products and AI recommendations for your Shopify store." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Dashboard() {
  const s = demoStore;
  const chart = s.daily.map((v, i) => ({ day: `D${i + 1}`, revenue: v }));
  const metrics = [
    { label: "Revenue", value: money(s.revenue), change: s.revenueChange, icon: DollarSign },
    { label: "Orders", value: s.orders.toString(), change: s.ordersChange, icon: ShoppingBag },
    { label: "Avg. order value", value: `$${s.aov.toFixed(2)}`, change: s.aovChange, icon: Receipt },
    { label: "Returning customers", value: `${s.returningRate}%`, change: null, icon: Users },
  ];
  return (
    <>
      <PageHeader
        title="Store overview"
        subtitle={`${s.period} · ${s.name}`}
        action={<Badge variant="outline" className="gap-1 border-warning text-foreground"><Info className="size-3" />Demo data — Shopify not connected</Badge>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="gap-0 p-5 shadow-card">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {m.label}
              <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><m.icon className="size-4" /></span>
            </div>
            <div className="mt-3 font-display text-2xl font-semibold">{m.value}</div>
            {m.change !== null && (
              <div className="mt-1 flex items-center gap-1 text-xs text-success"><TrendingUp className="size-3" />+{m.change}% vs prior period</div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="gap-0 p-5 shadow-card lg:col-span-2">
          <h2 className="text-base font-semibold">Sales trend</h2>
          <p className="text-xs text-muted-foreground">Daily revenue, last 14 days (demo)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => money(v)} contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="gap-0 p-5 shadow-card">
          <h2 className="text-base font-semibold">Top products</h2>
          <ul className="mt-4 space-y-3">
            {s.topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.units} units</div>
                </div>
                <div className="text-sm font-semibold">{money(p.revenue)}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 gap-0 overflow-hidden p-0 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-brand p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-5" />
            <h2 className="text-base font-semibold">AI Recommendations</h2>
          </div>
          <span className="text-xs opacity-80">Sample recommendations for the demo data (pre-written, not live AI)</span>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3">
          {demoRecommendations.map((r) => (
            <div key={r.title} className="rounded-lg border p-4">
              <Badge variant={r.priority === "High" ? "default" : "secondary"}>{r.priority} priority</Badge>
              <h3 className="mt-3 text-sm font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Button asChild variant="teal" size="sm">
            <Link to="/advisor">Ask the Store Advisor <ArrowRight /></Link>
          </Button>
        </div>
      </Card>
    </>
  );
}
