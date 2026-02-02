import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are VOPSy, an AI operations assistant for Virtual OPS Hub. 

Your capabilities:
- Draft professional emails
- Create business documents (proposals, contracts, reports)
- Help organize tasks and schedules
- Provide business insights and recommendations
- Answer questions about business operations

Your personality:
- Professional but friendly
- Concise and helpful
- Action-oriented - always suggest next steps
- Proactive - anticipate what the user might need

Important rules:
- Always be helpful and constructive
- If you can't do something, explain why and suggest alternatives
- Keep responses focused and actionable
- When drafting content, ask clarifying questions if needed`;

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
