import { NextResponse } from "next/server";

type GroqRequest = {
  prompt: string;
  model?: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = (await req.json()) as GroqRequest;
  if (!body?.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  const model = body.model ?? "llama-3.1-8b-instant";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: body.prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Groq request failed.", details: text },
      { status: 502 }
    );
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ text });
}
