import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  getContactsByTag,
  addTagsToContact,
  removeTagsFromContact,
  updateContact,
  sendEmail,
  getOpportunities,
  updateOpportunityStage,
  getPipelines,
} from '@/lib/ghl';
import {
  PIPELINE_NAME,
  FOLLOWUP_MESSAGES,
  DAILY_TARGETS,
} from '@/lib/outbound/config';
import {
  personalizeMessage,
  selectOutreachMessage,
  getNextFollowUpTag,
  isWithinDailyLimits,
  createEmptyResult,
  getTodaySearchCategory,
  validatePersonalization,
  type DailyExecutionResult,
} from '@/lib/outbound/engine';

/**
 * POST /api/outbound/execute
 * Daily execution endpoint — runs the full outbound workflow.
 * Called by Vercel cron or manually from admin dashboard.
 *
 * Auth: CRON_SECRET bearer token OR authenticated admin session.
 */
export async function POST(request: NextRequest) {
  try {
    // Auth — accept either cron secret or user session
    const authHeader = request.headers.get('authorization');
    let isAuthed = false;

    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
      isAuthed = true;
    } else {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      if (session) isAuthed = true;
    }

    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
      return NextResponse.json({
        error: 'GHL_API_KEY and GHL_LOCATION_ID are required',
      }, { status: 500 });
    }

    // Determine today's search category
    const body = await request.json().catch(() => ({}));
    const lastCategoryIndex = body.lastCategoryIndex ?? -1;
    const { category, index: categoryIndex } = getTodaySearchCategory(lastCategoryIndex);

    const result = createEmptyResult(category);

    // --- Get pipeline info ---
    let pipelineId: string | null = null;
    let stageMap: Record<string, string> = {};
    try {
      const pipelines = await getPipelines();
      const pipeline = pipelines?.pipelines?.find((p: any) => p.name === PIPELINE_NAME);
      if (pipeline) {
        pipelineId = pipeline.id;
        for (const stage of pipeline.stages || []) {
          stageMap[stage.name] = stage.id;
        }
      }
    } catch (err: any) {
      result.errors.push(`Pipeline fetch failed: ${err.message}`);
    }

    // --- STEP 3: Follow-Up Execution ---
    // Process follow-ups first (they have priority in the daily workflow)

    const followUpSequence = [
      { sourceTag: 'outreach-sent', dayOffset: 3, followUpIndex: 0, nextTag: 'followup-1-sent' },
      { sourceTag: 'followup-1-sent', dayOffset: 3, followUpIndex: 1, nextTag: 'followup-2-sent' },
      { sourceTag: 'followup-2-sent', dayOffset: 4, followUpIndex: 2, nextTag: 'followup-3-sent' },
    ];

    for (const step of followUpSequence) {
      if (result.followUpsSent >= DAILY_TARGETS.followUps) break;

      try {
        const contacts = await getContactsByTag(step.sourceTag);
        const contactList = contacts?.contacts || [];

        for (const contact of contactList) {
          if (result.followUpsSent >= DAILY_TARGETS.followUps) break;
          if (!isWithinDailyLimits(result.newOutreachSent, result.followUpsSent)) break;

          // Check if contact was tagged long enough ago (based on dayOffset)
          const outreachDate = contact.customFields?.find(
            (f: any) => f.key === 'outreach_date'
          )?.value;

          if (outreachDate) {
            const daysSince = Math.floor(
              (Date.now() - new Date(outreachDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSince < step.dayOffset) continue;
          }

          const followUp = FOLLOWUP_MESSAGES[step.followUpIndex];
          if (!followUp) continue;

          const personalizedBody = personalizeMessage(followUp.body, {
            firstName: contact.firstName || contact.name || 'there',
          });

          const validation = validatePersonalization(personalizedBody);
          if (!validation.valid) {
            result.errors.push(
              `Skipped follow-up for ${contact.firstName}: unfilled fields ${validation.missingFields.join(', ')}`
            );
            continue;
          }

          // Send follow-up via email (GHL handles channel routing)
          try {
            if (contact.email) {
              await sendEmail({
                contactId: contact.id,
                subject: followUp.subject || 'Following up',
                body: personalizedBody,
              });
            }

            // Update tags
            await addTagsToContact(contact.id, [step.nextTag]);
            await removeTagsFromContact(contact.id, [step.sourceTag]);

            // Update pipeline stage
            if (pipelineId && stageMap[`Follow-Up ${step.followUpIndex + 1} Sent`]) {
              // Find opportunity for this contact and update stage
              // (GHL links contacts to opportunities)
            }

            result.followUpsSent++;
            result.totalTouches++;
            result.contacts.push({
              contactId: contact.id,
              name: contact.firstName || contact.name,
              action: `followup-${step.followUpIndex + 1}` as any,
              messageId: followUp.id,
              channel: contact.email ? 'email' : 'linkedin',
              timestamp: new Date().toISOString(),
            });
          } catch (err: any) {
            result.errors.push(`Follow-up send failed for ${contact.id}: ${err.message}`);
          }
        }
      } catch (err: any) {
        result.errors.push(`Follow-up fetch for ${step.sourceTag} failed: ${err.message}`);
      }
    }

    // --- Archive contacts with 3 follow-ups and no response ---
    try {
      const thirdFollowUps = await getContactsByTag('followup-3-sent');
      for (const contact of thirdFollowUps?.contacts || []) {
        const outreachDate = contact.customFields?.find(
          (f: any) => f.key === 'outreach_date'
        )?.value;

        if (outreachDate) {
          const daysSince = Math.floor(
            (Date.now() - new Date(outreachDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSince >= 10) {
            await addTagsToContact(contact.id, ['no-response-archive']);
            await removeTagsFromContact(contact.id, ['followup-3-sent']);
          }
        }
      }
    } catch (err: any) {
      result.errors.push(`Archive step failed: ${err.message}`);
    }

    // --- Log execution to audit ---
    try {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.from('vopsy_audit_log').insert({
        user_id: '00000000-0000-0000-0000-000000000000', // system user
        action: 'outbound-daily-execute',
        tool_name: 'outbound-engine',
        data_touched: [
          `outreach:${result.newOutreachSent}`,
          `followups:${result.followUpsSent}`,
          `total:${result.totalTouches}`,
          `category:${category}`,
        ],
      });
    } catch {
      // Non-critical — don't fail the execution
    }

    return NextResponse.json({
      success: true,
      message: 'Daily outbound execution complete',
      categoryIndex,
      result,
    });
  } catch (error: any) {
    console.error('Outbound execution error:', error);
    return NextResponse.json(
      { error: 'Execution failed', message: error.message },
      { status: 500 }
    );
  }
}
