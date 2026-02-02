import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This endpoint is called by Vercel Cron to automatically downgrade expired AI Cohort users
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Call the database function to downgrade expired users
    const { data, error } = await supabase.rpc('api_downgrade_expired_cohort_users');

    if (error) {
      console.error('Error downgrading expired users:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    console.log('Downgrade cron completed:', data);

    return NextResponse.json({
      success: true,
      downgraded_count: data.downgraded_count,
      timestamp: data.timestamp
    });

  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
