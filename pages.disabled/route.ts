// Archived app route — moved here to avoid server runtime.
// Original purpose: proxy requests to Gemini API. If you need the AI route
// later, restore this file to the project root as `route.ts` and ensure
// you accept the server runtime implications.

import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const text = await gemini.generateText(prompt);
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API error (archived route):', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
