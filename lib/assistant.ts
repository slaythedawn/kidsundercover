import { assistant, type Intent, type Link } from "@/content/home";

export type AssistantAnswer = {
  reply: string;
  links: Link[];
  intentId: string | null;
  source: "intent" | "claude" | "fallback";
};

/** Match a free text question to an intent using the keywords in content/home.ts. */
export function matchIntent(question: string): Intent | null {
  const q = question.toLowerCase();
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of assistant.intents) {
    // Longer keyword matches count for more, so "carer" beats "car".
    const score = intent.keywords.reduce((n, k) => (startsWord(q, k) ? n + k.length : n), 0);
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  if (best) return best.intent;
  // Plain "I want to donate" style questions with no other clue.
  if (/donat/.test(q)) return assistant.intents.find((i) => i.id === "donate") ?? null;
  return null;
}

function startsWord(text: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}`).test(text);
}

export function answerFromIntent(intent: Intent | null): AssistantAnswer {
  if (!intent) {
    return { reply: assistant.fallback, links: [], intentId: null, source: "fallback" };
  }
  return { reply: intent.reply, links: intent.links, intentId: intent.id, source: "intent" };
}
