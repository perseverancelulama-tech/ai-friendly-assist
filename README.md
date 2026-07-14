# Muse — AI Productivity Assistant

Muse is an AI-powered productivity assistant that helps you write better emails, summarize meeting notes, and plan your day — all in one place. Built with TanStack Start and powered by the Lovable AI Gateway (Gemini 3 Flash).

## ✨ Features

### 1. Smart Email Generator
Generate well-written, professional emails in seconds from a short prompt.
- Multiple tones: **Formal**, **Friendly**, **Persuasive**, **Apologetic**, **Follow-up**
- Auto-generated subject lines
- Improved grammar and clarity
- Customizable length and style

### 2. Meeting Notes Summarizer
Turn long, messy meeting notes into clean, structured summaries.
- Key discussion points
- Decisions made
- Action items with owners
- Deadlines and next steps

### 3. AI Task Planner / Scheduler
Create intelligent daily or weekly schedules based on priorities and deadlines.
- Daily or weekly plans
- Prioritization by urgency and importance
- Time-blocking for each task
- Balanced workload with suggested breaks and focus sessions

## 🛠️ Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **AI:** Lovable AI Gateway (`google/gemini-3-flash-preview`)
- **Language:** TypeScript
- **Runtime:** Cloudflare Workers (edge)

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev
```

The app runs at `http://localhost:8080`.

## 🔑 Environment

This project uses the Lovable AI Gateway. When developing inside Lovable, the `LOVABLE_API_KEY` is provided automatically. For self-hosting, set it in your environment:

```bash
LOVABLE_API_KEY=your_key_here
```

## 📁 Project Structure

```
src/
├── routes/
│   ├── __root.tsx      # App shell + metadata
│   └── index.tsx       # Main UI with 3 tabs
├── lib/
│   └── ai.functions.ts # Server function calling the AI gateway
└── styles.css          # Warm dark theme tokens
```

## 📄 License

MIT
