import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createGatewayModel, friendlyAiError, jsonError, reasoningOptions } from "@/lib/ai.server";
import { storeContextText } from "@/lib/demo-data";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { messages?: UIMessage[]; storeNotes?: string } | null;
        const messages = body?.messages;
        if (!Array.isArray(messages) || messages.length === 0 || messages.length > 60)
          return jsonError(400, "Invalid conversation.");
        const notes = (body?.storeNotes ?? "").slice(0, 4000).trim();
        try {
          const result = streamText({
            model: createGatewayModel(request),
            instructions: `You are StorePilot AI, a practical e-commerce advisor for a Shopify store owner.
Use ONLY the store data below and what the user tells you. The store data is DEMO SAMPLE data — mention that when you rely on it. Shopify is NOT connected.
If you need information you don't have (margins, ad spend, inventory, traffic sources, etc.), ask for it briefly instead of inventing numbers.
Give prioritized, actionable recommendations (numbered, highest impact first, with why and a first step). Be concise. Use simple markdown (bold, lists).

${storeContextText()}
${notes ? `\nOWNER-PROVIDED INFO:\n${notes}` : ""}`,
            messages: await convertToModelMessages(messages),
            abortSignal: request.signal,
            providerOptions: reasoningOptions,
          });
          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            onError: (e) => friendlyAiError(e).message,
          });
        } catch (e) {
          const { status, message } = friendlyAiError(e);
          return jsonError(status, message);
        }
      },
    },
  },
});
