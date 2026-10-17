import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Compass, Loader2, Send, Square, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Store Advisor — StorePilot AI" },
      { name: "description", content: "Chat with an AI advisor about your store and get prioritized recommendations." },
      { property: "og:title", content: "AI Store Advisor — StorePilot AI" },
      { property: "og:description", content: "Chat with an AI advisor about your store and get prioritized recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Advisor,
});

const starters = [
  "What should I focus on this week to grow revenue?",
  "How can I reduce returns on the denim jacket?",
  "Is my average order value healthy?",
];

function Advisor() {
  const [notes, setNotes] = useState("");
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: () => ({ storeNotes: notesRef.current }) }),
    [],
  );
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({ transport });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [messages, status]);
  useEffect(() => { if (!busy) inputRef.current?.focus(); }, [busy]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t.slice(0, 4000) });
    setInput("");
  };

  return (
    <>
      <PageHeader
        title="AI Store Advisor"
        subtitle="Ask about your store. Answers use demo store data plus anything you share."
        action={messages.length > 0 && <Button variant="outline" size="sm" onClick={() => setMessages([])}><RotateCcw /> New conversation</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="flex h-[70vh] flex-col gap-0 p-0 shadow-card lg:col-span-3">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="grid size-12 place-items-center rounded-xl bg-brand text-primary-foreground"><Compass /></div>
                <p className="mt-3 text-sm text-muted-foreground">Try one of these:</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {starters.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>{s}</Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
                {m.role !== "user" && <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-primary-foreground"><Compass className="size-4" /></div>}
                <div className={m.role === "user" ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground" : "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed"}>
                  {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text.replace(/\*\*/g, "")}</span> : null))}
                </div>
              </div>
            ))}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Thinking…</div>
            )}
            {error && <Alert variant="destructive"><AlertDescription>{error.message || "The advisor couldn't respond. Please try again."}</AlertDescription></Alert>}
            <div ref={endRef} />
          </div>
          <form className="flex items-end gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <Textarea
              ref={inputRef}
              autoFocus
              rows={1}
              maxLength={4000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask about sales, products, marketing…"
              className="max-h-40 min-h-10 resize-none"
            />
            {busy ? (
              <Button type="button" variant="outline" size="icon" onClick={() => stop()} aria-label="Stop"><Square /></Button>
            ) : (
              <Button type="submit" variant="teal" size="icon" disabled={!input.trim()} aria-label="Send"><Send /></Button>
            )}
          </form>
        </Card>
        <Card className="gap-0 p-5 shadow-card">
          <h2 className="text-sm font-semibold">Your store info</h2>
          <p className="mt-1 text-xs text-muted-foreground">Optional. Add facts like margins, ad spend or goals so advice is grounded in your numbers.</p>
          <Textarea className="mt-3" rows={8} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Gross margin 55%, $1,200/mo on Meta ads, goal: $60k next month" />
          <p className="mt-3 text-xs text-muted-foreground">Shopify is not connected. The advisor uses clearly labeled demo data.</p>
        </Card>
      </div>
    </>
  );
}
