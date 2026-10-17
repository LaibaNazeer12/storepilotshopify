import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ScanSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader, readError } from "@/components/page-header";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Customer Insights — StorePilot AI" },
      { name: "description", content: "Analyze customer reviews for sentiment, complaints, needs and improvements." },
      { property: "og:title", content: "Customer Insights — StorePilot AI" },
      { property: "og:description", content: "Analyze customer reviews for sentiment, complaints, needs and improvements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Insights,
});

type Finding = { title: string; explanation: string; quotes: string[] };
type Result = {
  overallSentiment: "positive" | "mixed" | "negative" | "neutral";
  sentimentSummary: string;
  complaints: Finding[];
  needs: Finding[];
  praise: Finding[];
  improvements: { priority: string; action: string; rationale: string }[];
};

const sample = `Love the hoodie, super soft and the color is exactly like the photos. 
Shipping took 12 days, way too long for a domestic order.
The denim jacket runs small. I ordered my usual M and had to return it. A size chart would help.
Great quality socks but the checkout kept failing on my phone.
Customer service replied fast and sorted my exchange. Would buy again, but please ship faster!`;

function Insights() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function analyze() {
    if (text.trim().length < 30) return setError("Paste at least 30 characters of customer feedback.");
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(await readError(res));
      setResult(await res.json());
    } catch (e) {
      setError((e as Error).message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Customer Insights" subtitle="Paste reviews or complaints. Findings are backed by exact quotes from your text." />
      <Card className="gap-0 p-5 shadow-card">
        <Textarea rows={8} maxLength={20000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste customer reviews, support tickets or survey answers…" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => setText(sample)}>Use sample reviews</Button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} / 20,000</span>
            <Button variant="teal" onClick={analyze} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <ScanSearch />} {loading ? "Analyzing…" : "Analyze feedback"}
            </Button>
          </div>
        </div>
        {error && <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>}
      </Card>

      {result && (
        <div className="mt-6 space-y-6">
          <Card className="gap-0 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold">Overall sentiment</h2>
              <Badge variant={result.overallSentiment === "negative" ? "destructive" : "secondary"} className="capitalize">{result.overallSentiment}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{result.sentimentSummary}</p>
          </Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Recurring complaints" items={result.complaints} />
            <Section title="Customer needs" items={result.needs} />
            <Section title="What customers love" items={result.praise} />
            <Card className="gap-0 p-5 shadow-card">
              <h2 className="text-base font-semibold">Suggested improvements</h2>
              {result.improvements.length === 0 && <p className="mt-2 text-sm text-muted-foreground">No clear improvements found in this text.</p>}
              <ol className="mt-3 space-y-3">
                {result.improvements.map((i) => (
                  <li key={i.action} className="rounded-lg border p-3">
                    <Badge variant={i.priority === "high" ? "default" : "secondary"} className="capitalize">{i.priority}</Badge>
                    <div className="mt-2 text-sm font-medium">{i.action}</div>
                    <div className="text-sm text-muted-foreground">{i.rationale}</div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, items }: { title: string; items: Finding[] }) {
  return (
    <Card className="gap-0 p-5 shadow-card">
      <h2 className="text-base font-semibold">{title}</h2>
      {items.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Nothing found in the provided text.</p>}
      <ul className="mt-3 space-y-4">
        {items.map((f) => (
          <li key={f.title}>
            <div className="text-sm font-medium">{f.title}</div>
            <p className="text-sm text-muted-foreground">{f.explanation}</p>
            {f.quotes.map((q) => (
              <blockquote key={q} className="mt-2 border-l-2 border-teal pl-3 text-sm italic">“{q}”</blockquote>
            ))}
          </li>
        ))}
      </ul>
    </Card>
  );
}
