import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getContactsByTag, getPipelines, getOpportunities } from '@/lib/ghl';
import { PIPELINE_NAME, OUTBOUND_TAGS, DAILY_TARGETS } from '@/lib/outbound/config';

/**
 * GET /api/outbound/status
 * Returns current outbound system status — pipeline counts, tag counts, and daily metrics.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
      return NextResponse.json({
        configured: false,
        error: 'GHL_API_KEY and GHL_LOCATION_ID are not configured.',
      });
    }

    const status: {
      configured: boolean;
      pipeline: any;
      tagCounts: Record<string, number>;
      dailyTargets: typeof DAILY_TARGETS;
      recentActivity: any[];
    } = {
      configured: true,
      pipeline: null,
      tagCounts: {},
      dailyTargets: DAILY_TARGETS,
      recentActivity: [],
    };

    // --- Pipeline Info ---
    try {
      const pipelines = await getPipelines();
      const pipeline = pipelines?.pipelines?.find((p: any) => p.name === PIPELINE_NAME);
      if (pipeline) {
        status.pipeline = {
          id: pipeline.id,
          name: pipeline.name,
          stages: pipeline.stages?.map((s: any) => ({
            id: s.id,
            name: s.name,
            position: s.position,
          })),
        };

        // Get opportunity counts per stage
        try {
          const opps = await getOpportunities(pipeline.id);
          if (opps?.opportunities) {
            for (const stage of pipeline.stages || []) {
              const count = opps.opportunities.filter(
                (o: any) => o.pipelineStageId === stage.id
              ).length;
              stage.count = count;
            }
          }
        } catch {
          // Non-critical
        }
      }
    } catch (err: any) {
      status.pipeline = { error: err.message };
    }

    // --- Tag Counts ---
    for (const tag of OUTBOUND_TAGS) {
      try {
        const contacts = await getContactsByTag(tag);
        status.tagCounts[tag] = contacts?.contacts?.length || 0;
      } catch {
        status.tagCounts[tag] = -1; // indicates error
      }
    }

    // --- Recent Audit Activity ---
    try {
      const { data: logs } = await supabase
        .from('vopsy_audit_log')
        .select('*')
        .in('action', ['outbound-daily-execute', 'outbound-setup'])
        .order('created_at', { ascending: false })
        .limit(10);
      status.recentActivity = logs || [];
    } catch {
      // Non-critical
    }

    return NextResponse.json(status);
  } catch (error: any) {
    console.error('Outbound status error:', error);
    return NextResponse.json(
      { error: 'Status check failed', message: error.message },
      { status: 500 }
    );
  }
}
