import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { assistant, impact, programs, site, target450 } from "@/content/home";
import { answerFromIntent, matchIntent, type AssistantAnswer } from "@/lib/assistant";

/**
 * The AI front door. Answers a visitor's free text question and points them
 * to the right next step.
 *
 * Without ANTHROPIC_API_KEY it matches keywords from content/home.ts, so the
 * prototype always works. With a key, Claude answers using only the facts
 * below, which are built from content/home.ts so they stay in sync.
 */

const intentIds = assistant.intents.map((i) => i.id) as [string, ...string[]];

const Answer = z.object({
  reply: z.string(),
  intentId: z.enum([...intentIds, "none"]),
});

const facts = [
  `Kids Under Cover is an Australian charity that stops youth homelessness before it starts.`,
  `${impact.headlineStart} ${impact.headlineHighlight} ${impact.headlineEnd}`,
  impact.body,
  ...impact.stats.map((st) => `${st.value} ${st.label}.`),
  ...programs.items.map((p) => `${p.name}: ${p.blurb}`),
  `Target450: ${target450.titleStart} ${target450.titleAccent}`,
  `Phone: ${site.phone}.`,
  ...assistant.intents.map((i) => `Next step "${i.id}" (${i.label}): ${i.reply}`),
].join("\n");

const system = `You are the assistant on the Kids Under Cover homepage. Visitors type a question and you give a short, warm answer, then point them to one next step.

Facts you can use:
${facts}

How to answer:
- Use only the facts above. If the answer isn't there, say you're not sure and suggest calling ${site.phone}. Never make up numbers, stories, eligibility rules or promises.
- Two or three short sentences at most. Plain, everyday language. Australian spelling. No dashes, no emojis, no lists.
- If someone may be in danger, tell them to call 000 first.
- Set intentId to the next step that fits best, or "none" if nothing fits.`;

export async function POST(req: Request) {
  let question = "";
  try {
    const body = (await req.json()) as { question?: unknown };
    question = typeof body.question === "string" ? body.question.trim().slice(0, 300) : "";
  } catch {
    // fall through to the empty question check
  }
  if (!question) {
    return Response.json(answerFromIntent(null), { status: 400 });
  }

  const keywordAnswer = answerFromIntent(matchIntent(question));
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(keywordAnswer);
  }

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 1024,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: zodOutputFormat(Answer) },
      system,
      messages: [{ role: "user", content: question }],
    });

    const parsed = response.stop_reason === "refusal" ? null : response.parsed_output;
    if (!parsed) return Response.json(keywordAnswer);

    const intent = assistant.intents.find((i) => i.id === parsed.intentId) ?? null;
    const answer: AssistantAnswer = {
      reply: parsed.reply,
      links: intent?.links ?? [],
      intentId: intent?.id ?? null,
      source: "claude",
    };
    return Response.json(answer);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`Assistant API error ${error.status}: ${error.message}`);
    } else {
      console.error("Assistant error", error);
    }
    return Response.json(keywordAnswer);
  }
}
