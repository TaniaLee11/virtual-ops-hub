import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - please log in first' }, { status: 401 });
    }

    const { inviteCode } = await request.json();

    if (!inviteCode) {
      return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
    }

    // Find the invite
    const { data: invite, error: inviteError } = await supabase
      .from('cohort_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('email', session.user.email)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ 
        error: 'Invalid invite code or email mismatch' 
      }, { status: 404 });
    }

    if (invite.status === 'accepted') {
      return NextResponse.json({ 
        error: 'This invite has already been used' 
      }, { status: 400 });
    }

    // Enroll user in AI Cohort
    const { error: enrollError } = await supabase.rpc('enroll_user_in_cohort', {
      user_id: session.user.id
    });

    if (enrollError) {
      console.error('Error enrolling user:', enrollError);
      return NextResponse.json({ 
        error: 'Failed to enroll in cohort' 
      }, { status: 500 });
    }

    // Mark invite as accepted
    await supabase
      .from('cohort_invites')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invite.id);

    return NextResponse.json({
      success: true,
      message: 'Welcome to the AI Cohort! You now have 60 days of full access.',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error: any) {
    console.error('Accept invite error:', error);
    return NextResponse.json({
      error: 'Failed to accept invite',
      details: error.message,
    }, { status: 500 });
  }
}
