import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, Wand2, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CopyButton, PageHeader, readError } from "@/components/page-header";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "AI Marketing Studio — StorePilot AI" },
      { name: "description", content: "Generate product descriptions, social posts, ad copy and promo emails with AI." },
      { property: "og:title", content: "AI Marketing Studio — StorePilot AI" },
      { property: "og:description", content: "Generate product descriptions, social posts, ad copy and promo emails with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Marketing,
});

const types = [
  { id: "product_description", label: "Product description" },
  { id: "social_post", label: "Social media post" },
  { id: "ad_copy", label: "Ad copy" },
  { id: "promo_email", label: "Promo email" },
] as const;

function Marketing() {
  const [form, setForm] = useState({ productName: "", description: "", audience: "", contentType: "product_description" as string });
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const validate = () => {
    if (form.productName.trim().length < 2) return "Enter a product name.";
    if (form.description.trim().length < 10) return "Describe the product in at least 10 characters.";
    if (form.audience.trim().length < 2) return "Enter a target audience.";
    return "";
  };

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");
    setOutput("");
    setLoading(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error(await readError(res));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setOutput((o) => o + dec.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PageHeader title="AI Marketing Studio" subtitle="Turn product details into ready-to-publish copy." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="gap-0 p-5 shadow-card lg:col-span-2">
          <form onSubmit={generate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pn">Product name</Label>
              <Input id="pn" maxLength={120} value={form.productName} onChange={set("productName")} placeholder="Organic Cotton Hoodie" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pd">Product description</Label>
              <Textarea id="pd" rows={5} maxLength={2000} value={form.description} onChange={set("description")} placeholder="Materials, features, what makes it special…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ta">Target audience</Label>
              <Input id="ta" maxLength={300} value={form.audience} onChange={set("audience")} placeholder="Eco-conscious millennials" />
            </div>
            <div className="space-y-1.5">
              <Label>Content type</Label>
              <div className="grid grid-cols-2 gap-2">
                {types.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setForm((f) => ({ ...f, contentType: t.id }))}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${form.contentType === t.id ? "border-teal bg-accent font-medium text-accent-foreground" : "hover:bg-muted"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <Button type="button" variant="outline" className="w-full" onClick={() => abort.current?.abort()}>
                <Square /> Stop
              </Button>
            ) : (
              <Button type="submit" variant="teal" className="w-full"><Wand2 /> Generate content</Button>
            )}
          </form>
        </Card>
        <Card className="gap-0 p-5 shadow-card lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Generated content</h2>
            <CopyButton text={output} />
          </div>
          {error && (
            <Alert variant="destructive" className="mb-3"><AlertDescription>{error}</AlertDescription></Alert>
          )}
          {loading && !output && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Writing your copy…</div>
          )}
          {output ? (
            <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">{output}</div>
          ) : (
            !loading && !error && <p className="text-sm text-muted-foreground">Fill in the form and click Generate. Your copy will appear here.</p>
          )}
        </Card>
      </div>
    </>
  );
}
