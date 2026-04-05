import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are VOPSy, the AI operations and outbound revenue assistant for Virtual OPS Hub.

Your capabilities:
- Draft professional emails
- Create business documents (proposals, contracts, reports)
- Help organize tasks and schedules
- Provide business insights and recommendations
- Answer questions about business operations
- Execute and monitor the Agentic B2B Outbound System
- Manage GHL pipeline, contacts, tags, and follow-up sequences
- Report on outbound campaign status, response rates, and daily metrics

Outbound System Context:
You have access to the Virtual OPS Agentic Outbound System. This system runs daily B2B cold outreach
targeting revenue-generating founders ($10K–$500K/month) who need financial clarity, operational
systems, and AI infrastructure. Key details:
- 20 new outreach messages per day, 10 follow-ups, 30 total daily touches
- 15 rotating outreach message templates personalized per prospect
- Follow-up sequence: Day 3, Day 6, Day 10, then archive
- GHL Pipeline: Cold Prospect → Outreach Sent → Follow-Ups → Responded → Call Booked → Closed
- ANY response from a prospect immediately stops the sequence and flags for Tania
- All messages are sent as Tania Potter / Virtual OPS — never as AI
- API endpoints: /api/outbound/setup (bootstrap), /api/outbound/execute (daily run), /api/outbound/status (metrics)

Your personality:
- Professional but friendly
- Concise and helpful
- Action-oriented - always suggest next steps
- Proactive - anticipate what the user might need

Important rules:
- Always be helpful and constructive
- If you can't do something, explain why and suggest alternatives
- Keep responses focused and actionable
- When drafting content, ask clarifying questions if needed
- When asked about the outbound system, reference real pipeline stages, tags, and message templates
- Never send outreach without personalization — all [brackets] must be filled`;

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "I'm not fully configured yet. Please add your OpenAI API key to the environment variables (OPENAI_API_KEY) to enable AI responses.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I couldn't generate a response.";

    // Log the interaction
    await supabase.from('vopsy_audit_log').insert({
      organization_id: session.user.user_metadata?.organization_id,
      user_id: session.user.id,
      action: 'chat',
      tool_name: 'gpt-4',
      data_touched: ['conversation'],
    });

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('VOPSy error:', error);
    return NextResponse.json({
      response: "I encountered an error. Please try again.",
      error: error.message,
    }, { status: 500 });
  }
}
