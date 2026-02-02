import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, inviteCode } = await request.json();

    if (!email || !inviteCode) {
      return NextResponse.json({ error: 'Email and invite code are required' }, { status: 400 });
    }

    // Construct invite email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualopsassist.com'}/cohort/accept?code=${inviteCode}`;
    
    const emailSubject = 'You\'re Invited to Join the AI Cohort at Virtual OPS';
    const emailBody = `
Hello,

You've been invited to join the exclusive AI Cohort at Virtual OPS!

**What's Included:**
• 60-day full access to Virtual OPS Hub
• AI Advisory Level service
• Weekly 1-on-1 sessions with Tania Potter
• AI Operations Level system access
• Agentic AI operations performed by Vopsy AI Agent (Ops Director)
• Priority support and guidance

**Accept Your Invite:**
Click here to get started: ${inviteUrl}

This is an invite-only program designed to help you leverage AI for your business operations.

Questions? Reply to this email or contact us at tania@virtualopsassist.com

Best regards,
Tania Potter
Virtual OPS
    `.trim();

    // Send email using Resend API
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Tania Potter <tania@virtualopsassist.com>',
          to: [email],
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.json();
        console.error('Resend API error:', error);
        throw new Error('Failed to send email via Resend');
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Invite email sent successfully',
        method: 'resend'
      });
    }

    // Fallback: Log email details if no email service configured
    console.log('Email would be sent:', {
      to: email,
      subject: emailSubject,
      body: emailBody,
      inviteUrl
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Invite created (email service not configured)',
      inviteUrl,
      method: 'fallback'
    });

  } catch (error: any) {
    console.error('Send invite error:', error);
    return NextResponse.json({
      error: 'Failed to send invite',
      details: error.message,
    }, { status: 500 });
  }
}
