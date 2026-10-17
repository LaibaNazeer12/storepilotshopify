import { createFileRoute } from "@tanstack/react-router";
import { Output, streamText } from "ai";
import { z } from "zod";
import { createGatewayModel, friendlyAiError, jsonError, reasoningOptions } from "@/lib/ai.server";

const input = z.object({ text: z.string().trim().min(30).max(20000) });

const finding = z.object({
  title: z.string(),
  explanation: z.string(),
  quotes: z.array(z.string()),
});

const resultSchema = z.object({
  overallSentiment: z.enum(["positive", "mixed", "negative", "neutral"]),
  sentimentSummary: z.string(),
  complaints: z.array(finding),
  needs: z.array(finding),
  improvements: z.array(
    z.object({ priority: z.enum(["high", "medium", "low"]), action: z.string(), rationale: z.string() }),
  ),
  praise: z.array(finding),
});

const norm = (s: string) => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();

export const Route = createFileRoute("/api/insights")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = input.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return jsonError(400, "Paste at least 30 characters of customer feedback (max 20,000).");
        const text = parsed.data.text;
        try {
          const result = streamText({
            model: createGatewayModel(request),
            instructions:
              "You analyze customer reviews for a Shopify store. Base every finding strictly on the provided text. Quotes MUST be copied verbatim (exact substrings) from the text; never paraphrase or invent them. Do not state review counts or percentages. If there is no evidence for a category, return an empty array. Keep each explanation to 1-2 sentences.",
            prompt: `Customer feedback:\n"""\n${text}\n"""`,
            output: Output.object({ schema: resultSchema }),
            abortSignal: request.signal,
            providerOptions: reasoningOptions,
          });
          const out = await result.output;
          const source = norm(text);
          const verify = (f: z.infer<typeof finding>) => ({
            ...f,
            quotes: f.quotes.filter((q) => q.trim().length > 2 && source.includes(norm(q))),
          });
          return Response.json({
            ...out,
            complaints: out.complaints.map(verify),
            needs: out.needs.map(verify),
            praise: out.praise.map(verify),
          });
        } catch (e) {
          const { status, message } = friendlyAiError(e);
          return jsonError(status, message);
        }
      },
    },
  },
});
