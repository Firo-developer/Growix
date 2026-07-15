import {NextResponse} from 'next/server';

const SYSTEM_PROMPT = `You are Growix, a practical business growth assistant for Ethiopian businesses.
Give useful, specific, and concise advice. Use clean Markdown whenever it improves clarity, including headings, bullet lists, numbered steps, tables, and LaTeX only when a formula is genuinely useful. Do not invent business facts; ask a focused follow-up question when key information is missing.`;

type ClientMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function errorMessage(payload: string) {
  try {
    const parsed = JSON.parse(payload) as {error?: {message?: string} | string; message?: string};
    if (typeof parsed.error === 'string') return parsed.error;
    if (parsed.error?.message) return parsed.error.message;
    if (parsed.message) return parsed.message;
  } catch {
    // The upstream service can return a non-JSON error body.
  }

  return 'The AI service could not complete this request.';
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({error: 'OpenRouter is not configured on this server.'}, {status: 503});
  }

  let body: {messages?: ClientMessage[]};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({error: 'Invalid assistant request.'}, {status: 400});
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({error: 'A message is required.'}, {status: 400});
  }

  const sanitizedMessages = messages
    .filter((message): message is ClientMessage => (
      (message.role === 'user' || message.role === 'assistant')
      && typeof message.content === 'string'
      && message.content.trim().length > 0
    ))
    .slice(-24)
    .map((message) => ({role: message.role, content: message.content.trim()}));

  if (sanitizedMessages.length === 0) {
    return NextResponse.json({error: 'A message is required.'}, {status: 400});
  }

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-OpenRouter-Title': 'Growix',
    },
    body: JSON.stringify({
      model: 'tencent/hy3:free',
      stream: true,
      messages: [{role: 'system', content: SYSTEM_PROMPT}, ...sanitizedMessages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({error: errorMessage(await upstream.text())}, {status: upstream.status || 502});
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
