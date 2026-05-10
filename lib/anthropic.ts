import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Lazy singleton — instantiating Anthropic at module load would crash
// builds where ANTHROPIC_API_KEY isn't set yet (CI, preview deploys
// before the env var lands). Throws only when a request actually needs
// Claude. Server-only — never bundle into client code.

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  _client = new Anthropic({ apiKey });
  return _client;
}

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
