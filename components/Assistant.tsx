"use client";

import { useRef, useState } from "react";
import { assistant } from "@/content/home";
import { answerFromIntent, type AssistantAnswer } from "@/lib/assistant";
import { Sparkle, Arrow } from "./icons";
import s from "./Assistant.module.css";

type Turn = { question: string; answer: AssistantAnswer | null };

export default function Assistant() {
  const [active, setActive] = useState<string | null>(null);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(id: string) {
    const intent = assistant.intents.find((i) => i.id === id) ?? null;
    setActive(id);
    setTurn({ question: intent?.label ?? "", answer: answerFromIntent(intent) });
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const question = text.trim();
    if (!question) return;
    setText("");
    setActive(null);
    setTurn({ question, answer: null });
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const answer = (await res.json()) as AssistantAnswer;
      setActive(answer.intentId);
      setTurn({ question, answer });
    } catch {
      setTurn({ question, answer: answerFromIntent(null) });
    }
  }

  return (
    <div className={`sheet sheet-stack ${s.card}`}>
      <span className={s.sun} aria-hidden="true" />

      <p className={s.label}>
        <span className={`ring ${s.badge}`}><Sparkle /></span>
        {assistant.label}
      </p>

      <h2 className={s.question}>{assistant.question}</h2>

      <div className={s.chips} role="group" aria-label="Choose what you're here for">
        {assistant.intents.map((intent, i) => (
          <button
            key={intent.id}
            type="button"
            className={s.chip}
            data-variant={i === 0 ? "ink" : i === 1 ? "sun" : "outline"}
            aria-pressed={active === intent.id}
            onClick={() => pick(intent.id)}
          >
            {intent.label}
          </button>
        ))}
      </div>

      <div className={s.answer} aria-live="polite">
        {turn && (
          <div className={s.bubble} key={turn.question}>
            {turn.answer ? (
              <>
                <p>{turn.answer.reply}</p>
                {turn.answer.links.length > 0 && (
                  <div className={s.next}>
                    {turn.answer.links.map((l, i) => (
                      <a key={l.href + l.label} href={l.href} className={i === 0 ? "btn btn-sun" : "btn btn-ghost"}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className={s.thinking}>{assistant.thinking}</p>
            )}
          </div>
        )}
      </div>

      <form className={s.ask} onSubmit={ask}>
        <label htmlFor="assistant-input" className="visually-hidden">Ask a question</label>
        <input
          id="assistant-input"
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={assistant.placeholder}
          autoComplete="off"
          maxLength={300}
        />
        <button type="submit" className={`ring ${s.send}`} aria-label="Ask">
          <Arrow />
        </button>
      </form>
    </div>
  );
}
