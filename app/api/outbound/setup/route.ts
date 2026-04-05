import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createPipeline, createTag, createCustomField, getPipelines, getTags } from '@/lib/ghl';
import { PIPELINE_NAME, PIPELINE_STAGES, OUTBOUND_TAGS, CUSTOM_FIELDS } from '@/lib/outbound/config';

/**
 * POST /api/outbound/setup
 * Bootstrap the GHL pipeline, tags, and custom fields for the outbound system.
 * Admin/owner only. Idempotent — skips existing resources.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
      return NextResponse.json({
        error: 'GHL_API_KEY and GHL_LOCATION_ID environment variables are required.',
      }, { status: 500 });
    }

    const results: {
      pipeline: any;
      tags: { created: string[]; skipped: string[]; errors: string[] };
      customFields: { created: string[]; errors: string[] };
    } = {
      pipeline: null,
      tags: { created: [], skipped: [], errors: [] },
      customFields: { created: [], errors: [] },
    };

    // --- 1. Create Pipeline ---
    try {
      const existingPipelines = await getPipelines();
      const existing = existingPipelines?.pipelines?.find(
        (p: any) => p.name === PIPELINE_NAME
      );

      if (existing) {
        results.pipeline = { status: 'already_exists', id: existing.id, stages: existing.stages };
      } else {
        const stages = PIPELINE_STAGES.map((s) => ({
          name: s.name,
          position: s.position,
        }));
        const pipeline = await createPipeline(PIPELINE_NAME, stages);
        results.pipeline = { status: 'created', ...pipeline };
      }
    } catch (err: any) {
      results.pipeline = { status: 'error', message: err.message };
    }

    // --- 2. Create Tags ---
    let existingTagNames: string[] = [];
    try {
      const tagsResponse = await getTags();
      existingTagNames = (tagsResponse?.tags || []).map((t: any) => t.name);
    } catch {
      // If we can't fetch tags, try creating them anyway
    }

    for (const tag of OUTBOUND_TAGS) {
      if (existingTagNames.includes(tag)) {
        results.tags.skipped.push(tag);
        continue;
      }
      try {
        await createTag(tag);
        results.tags.created.push(tag);
      } catch (err: any) {
        results.tags.errors.push(`${tag}: ${err.message}`);
      }
    }

    // --- 3. Create Custom Fields ---
    for (const field of CUSTOM_FIELDS) {
      try {
        await createCustomField({
          name: field.name,
          dataType: field.dataType,
          placeholder: field.placeholder,
        });
        results.customFields.created.push(field.name);
      } catch (err: any) {
        results.customFields.errors.push(`${field.name}: ${err.message}`);
      }
    }

    // Log setup action
    await supabase.from('vopsy_audit_log').insert({
      user_id: session.user.id,
      action: 'outbound-setup',
      tool_name: 'ghl-pipeline',
      data_touched: ['pipeline', 'tags', 'custom_fields'],
    });

    return NextResponse.json({
      success: true,
      message: 'Outbound system setup complete',
      results,
    });
  } catch (error: any) {
    console.error('Outbound setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', message: error.message },
      { status: 500 }
    );
  }
}
