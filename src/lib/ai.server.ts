import { createOpenAI } from "@ai-sdk/openai";
import { APICallError } from "ai";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
export const AI_MODEL = "openai/gpt-6-astra";

export function createGatewayModel(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new ConfigError();
  let runId = request.headers.get(RUN_ID_HEADER)?.trim() || undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      return res;
    },
  });
  return provider.responses(AI_MODEL);
}

export const reasoningOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

export class ConfigError extends Error {
  constructor() {
    super("AI is not configured: the LOVABLE_API_KEY secret is missing on the server.");
  }
}

export function friendlyAiError(error: unknown): { status: number; message: string } {
  if (error instanceof ConfigError) return { status: 500, message: error.message };
  const e = (error as { cause?: unknown })?.cause ?? error;
  if (APICallError.isInstance(e) || APICallError.isInstance(error)) {
    const err = (APICallError.isInstance(e) ? e : error) as APICallError;
    const status = err.statusCode ?? 500;
    if (status === 429) return { status, message: "Too many AI requests right now. Please wait a moment and try again." };
    if (status === 402) return { status, message: "AI credits are used up for this workspace. Add credits in Lovable to continue." };
    if (status === 403) return { status, message: "AI access is blocked for this workspace (limit or policy). Ask a workspace admin." };
    if (status === 401) return { status, message: "AI key is invalid or missing on the server." };
    return { status, message: "The AI service returned an error. Please try again." };
  }
  if ((error as Error)?.name === "AbortError") return { status: 499, message: "Request cancelled." };
  console.error("AI error", error);
  return { status: 500, message: "Something went wrong while generating. Please try again." };
}

export function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
