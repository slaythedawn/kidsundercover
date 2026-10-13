# Kids Under Cover homepage prototype

A working prototype of the new kuc.org.au homepage, built from the design in the Pathway 2 deck. Edit it by chatting with Claude: ask for a change in plain English and Claude updates the code. See `CLAUDE.md` for how the project is laid out.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## The AI front door

The "What brings you here today?" card works straight away: the five buttons give an instant answer with next steps, and typed questions are matched to the closest answer.

To have Claude answer typed questions, copy `.env.example` to `.env.local` and add an Anthropic API key. Claude only uses facts from `content/home.ts`, and if anything goes wrong the page falls back to the built in answers.

## What's on the page

1. AI front door over the hero photo
2. Impact intro with a hand made illustration
3. Programs as printed photos with brush labels
4. The neighbourhood: animated scale with three tabs
5. Ways to support us
6. Target450 on paper
7. Stories as printed photos
8. Footer, plus a frosted donate bar on phones

## Still to confirm with KUC

Search `content/home.ts` for `CONFIRM`: exact page URLs on kuc.org.au, Target450 progress to date, a photo for "Get support" and for "Nana's car leaves a legacy".
