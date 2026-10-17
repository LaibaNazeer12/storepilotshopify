import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";
import { createGatewayModel, friendlyAiError, jsonError, reasoningOptions } from "@/lib/ai.server";

const schema = z.object({
  productName: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  audience: z.string().trim().min(2).max(300),
  contentType: z.enum(["product_description", "social_post", "ad_copy", "promo_email"]),
});

const guides: Record<z.infer<typeof schema>["contentType"], string> = {
  product_description: "a persuasive Shopify product description (headline, 1 short paragraph, 4-6 benefit bullets)",
  social_post: "3 social media post variations (Instagram/Facebook/X) with emojis used sparingly and relevant hashtags",
  ad_copy: "ad copy: 3 headline options (max 40 chars), 2 primary text options, and a call to action",
  promo_email: "a promotional email: 3 subject line options, preview text, and a short body with a clear CTA",
};

export const Route = createFileRoute("/api/marketing")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = schema.safeParse(body);
        if (!parsed.success) return jsonError(400, "Please fill in all fields (description at least 10 characters).");
        const d = parsed.data;
        try {
          const result = streamText({
            model: createGatewayModel(request),
            instructions:
              "You are an expert e-commerce copywriter for Shopify stores. Write ready-to-use copy in plain text with simple markdown-free formatting (use line breaks and '-' bullets). Only use facts from the provided product details; do not invent specs, prices, discounts, or claims. Use [placeholders] for anything unknown like discount codes.",
            prompt: `Write ${guides[d.contentType]}.\n\nProduct name: ${d.productName}\nProduct details: ${d.description}\nTarget audience: ${d.audience}`,
            abortSignal: request.signal,
            providerOptions: reasoningOptions,
          });
          return result.toTextStreamResponse();
        } catch (e) {
          const { status, message } = friendlyAiError(e);
          return jsonError(status, message);
        }
      },
    },
  },
});
