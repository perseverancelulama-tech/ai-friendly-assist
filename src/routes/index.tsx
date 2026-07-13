import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, ClipboardList, CalendarClock, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { generateAI } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muse — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, and plan your day with an AI productivity assistant.",
      },
      { property: "og:title", content: "Muse — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Emails, meeting notes, and smart schedules — powered by AI.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary/10 via-accent/5 to-transparent" />

      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Muse</span>
        </div>
        <span className="text-xs text-muted-foreground">AI Productivity Assistant</span>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pb-24 pt-10">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Do your best work,{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              faster.
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Three tools to remove the friction from your day — draft emails, distill meetings,
            and plan tomorrow with clarity.
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" /> Email
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <ClipboardList className="h-4 w-4" /> Notes
            </TabsTrigger>
            <TabsTrigger value="planner" className="gap-2">
              <CalendarClock className="h-4 w-4" /> Planner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-6">
            <EmailGenerator />
          </TabsContent>
          <TabsContent value="notes" className="mt-6">
            <NotesSummarizer />
          </TabsContent>
          <TabsContent value="planner" className="mt-6">
            <TaskPlanner />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function useAI() {
  const fn = useServerFn(generateAI);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async (system: string, prompt: string) => {
    setLoading(true);
    setOutput("");
    try {
      const { text } = await fn({ data: { system, prompt } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { loading, output, run, setOutput };
}

function ResultCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="mt-6 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Result
        </span>
        <Button size="sm" variant="ghost" onClick={copy} className="h-8 gap-1.5">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
        {text}
      </pre>
    </Card>
  );
}

/* --------- 1. Email Generator --------- */
function EmailGenerator() {
  const { loading, output, run } = useAI();
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");

  const submit = () => {
    if (!prompt.trim()) return toast.error("Describe what the email is about");
    const system = `You are an expert email writer. Write a ${tone.toLowerCase()} email of ${length.toLowerCase()} length.
- Include a compelling subject line on the first line, formatted "Subject: ...".
- Then the email body, well-structured with clear paragraphs.
- Improve grammar and clarity. Do not add commentary or markdown fences.`;
    run(system, prompt);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Smart Email Generator</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Turn a rough idea into a polished, ready-to-send email.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Formal", "Friendly", "Persuasive", "Apologetic", "Follow-up"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Short", "Medium", "Long"].map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <Label>What's the email about?</Label>
        <Textarea
          className="mt-1.5 min-h-32"
          placeholder="e.g. Follow up with Sarah about the Q3 proposal — thank her, restate key benefits, ask for a meeting next week."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <Button onClick={submit} disabled={loading} className="mt-4 gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Generate email
      </Button>

      <ResultCard text={output} />
    </Card>
  );
}

/* --------- 2. Meeting Notes Summarizer --------- */
function NotesSummarizer() {
  const { loading, output, run } = useAI();
  const [notes, setNotes] = useState("");
  const [participants, setParticipants] = useState("");

  const submit = () => {
    if (!notes.trim()) return toast.error("Paste your meeting notes");
    const system = `You are an expert meeting analyst. Given raw meeting notes, produce a clean structured summary using EXACTLY these sections and headings:

Summary: <1-2 sentence overview>

Decisions:
- <decision>

Action Items:
- <Name> → <task> (due <date if known>)

Deadlines:
- <date> — <what is due>

Key Discussion Points:
- <point>

Use plain text, no markdown asterisks. If a section has no content, write "None".
${participants.trim() ? `Known participants: ${participants}.` : ""}`;
    run(system, notes);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Meeting Notes Summarizer</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Turn messy notes into decisions, action items, and deadlines.
      </p>

      <div className="mt-5">
        <Label>Participants (optional)</Label>
        <Input
          className="mt-1.5"
          placeholder="Alice, Bob, Priya"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <Label>Meeting notes</Label>
        <Textarea
          className="mt-1.5 min-h-48"
          placeholder="Paste your raw meeting notes or transcript here…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button onClick={submit} disabled={loading} className="mt-4 gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Summarize
      </Button>

      <ResultCard text={output} />
    </Card>
  );
}

/* --------- 3. Task Planner --------- */
function TaskPlanner() {
  const { loading, output, run } = useAI();
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Daily");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");

  const submit = () => {
    if (!tasks.trim()) return toast.error("List your tasks");
    const system = `You are an expert productivity coach. Build a ${horizon.toLowerCase()} schedule from the user's tasks.

Rules:
- Working hours: ${start} to ${end}.
- Prioritize by urgency and importance (deadlines first, then high-impact work).
- Allocate realistic time blocks and label each block "HH:MM–HH:MM — Task (priority)".
- Include short breaks and one longer focus/deep-work session.
- Balance workload; do not overload one part of the day.
- If horizon is Weekly, group by day (Monday, Tuesday…).

Output format:
Plan Overview: <1-2 sentence strategy>

Schedule:
${horizon === "Weekly" ? "Monday:\n  09:00–10:30 — ...\n..." : "09:00–10:30 — ..."}

Tips:
- <tip>`;
    run(system, tasks);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">AI Task Planner</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Build an intelligent schedule that respects priorities and deadlines.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Horizon</Label>
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Start</Label>
          <Input
            type="time"
            className="mt-1.5"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <Label>End</Label>
          <Input
            type="time"
            className="mt-1.5"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label>Tasks (one per line — include deadlines & priorities if any)</Label>
        <Textarea
          className="mt-1.5 min-h-40 font-mono text-sm"
          placeholder={`Finish Q3 report — due Friday, high priority\nReview PRs — 1 hour\nCall with design team\nGym\nRead 20 pages`}
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
        />
      </div>

      <Button onClick={submit} disabled={loading} className="mt-4 gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Build my schedule
      </Button>

      <ResultCard text={output} />
    </Card>
  );
}
