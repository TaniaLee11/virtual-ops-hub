/**
 * Outbound system configuration — pipeline stages, tags, search categories, and messages.
 * VOPSy reads this config to execute the daily outbound workflow.
 */

// --- Pipeline Stages ---
export const PIPELINE_NAME = 'Virtual OPS Outbound';

export const PIPELINE_STAGES = [
  { name: 'Cold Prospect', position: 0 },
  { name: 'Outreach Sent', position: 1 },
  { name: 'Follow-Up 1 Sent', position: 2 },
  { name: 'Follow-Up 2 Sent', position: 3 },
  { name: 'Follow-Up 3 Sent', position: 4 },
  { name: 'Responded', position: 5 },
  { name: 'Call Booked', position: 6 },
  { name: 'Proposal Sent', position: 7 },
  { name: 'Closed — Won', position: 8 },
  { name: 'Closed — Lost', position: 9 },
  { name: 'No Response — Archive', position: 10 },
] as const;

// --- Tags ---
export const OUTBOUND_TAGS = [
  'cold-outreach-day0',
  'outreach-sent',
  'followup-1-sent',
  'followup-2-sent',
  'followup-3-sent',
  'no-response-archive',
  'active-conversation',
  'call-booked',
  'icp-verified',
  'linkedin-prospect',
  'email-prospect',
  'instagram-prospect',
] as const;

export type OutboundTag = (typeof OUTBOUND_TAGS)[number];

// --- Search Categories (rotate daily, never repeat two days in a row) ---
export const SEARCH_CATEGORIES = [
  'Consultants billing $5K–$50K/month with no visible ops system',
  'Coaches with a team of VAs but no documented processes',
  'E-commerce founders doing $50K+/month with manual fulfillment workflows',
  'Agency owners (marketing, PR, creative) with 3–15 employees',
  'Real estate investors or brokers managing multiple deals simultaneously',
  'Healthcare practice owners (private pay, not insurance-dependent)',
  'Law firm partners or solo attorneys with growing caseloads',
  'Financial advisors or wealth managers building their own RIA',
  'Construction or trade business owners scaling past $500K/year',
  'Event planners or production companies with recurring high-value clients',
  'Recruiting or staffing firm owners with active placements',
  'Tech startup founders post-revenue but pre-Series A',
  'Online course creators doing $10K+/month with no backend automation',
  'Fractional executives (CFO, COO, CMO) building their own practice',
  'Non-profit executive directors managing grants and programs',
  'Franchise owners operating multiple locations',
  'Subscription box or membership business owners',
  'SaaS founders with product-market fit but operational chaos',
  'Import/export or distribution business owners',
  'Professional service firms (accounting, HR, IT) growing past founder capacity',
] as const;

// --- Channel Types ---
export type Channel = 'linkedin' | 'email' | 'instagram' | 'sms';

export const CHANNEL_PRIORITY: Channel[] = ['linkedin', 'email', 'instagram'];

// --- Outreach Messages ---
export interface OutreachMessage {
  id: string;
  name: string;
  channel: Channel | Channel[];
  subject?: string; // email only
  body: string;
}

export const OUTREACH_MESSAGES: OutreachMessage[] = [
  {
    id: 'msg-01',
    name: 'The Revenue Leak',
    channel: 'linkedin',
    body: `Hey [First Name] —

I was looking at your profile and I had a question.

You're clearly generating real revenue — [reference something specific from their profile].

But I'm curious: do you actually know where it's going? Like, do you have a clear picture of your margins, your cash position, and where you're losing money in the operation?

Most founders at your stage don't. Not because they're not smart — because they're too busy running the business to build the system that tells them what's really happening.

Just curious what your situation actually looks like.

— Tania | Virtual OPS`,
  },
  {
    id: 'msg-02',
    name: 'The Chaos Question',
    channel: 'linkedin',
    body: `Hey [First Name] —

Quick honest question — how much of your week is still spent doing things that have nothing to do with what you're actually good at?

I ask because I work with founders in your space and the pattern is almost always the same: the revenue is there, but the backend is held together with spreadsheets, memory, and hope.

Not judging — just asking if that's where you are right now.

— Tania`,
  },
  {
    id: 'msg-03',
    name: 'The Time Trap',
    channel: 'email',
    subject: 'The $10K problem most $10K/month founders have',
    body: `Hey [First Name],

Here's something I see constantly:

A founder is making real money. Good clients. Real revenue. But they're working 60-hour weeks because everything still runs through them personally.

No system. No automation. No way to step back without things falling apart.

The business is growing. The owner is drowning.

I work with founders to fix exactly that — the operational and financial backend that makes growth actually sustainable.

Is that a conversation worth having?

— Tania Potter
Founder, Virtual OPS
virtualopsassist.com`,
  },
  {
    id: 'msg-04',
    name: 'The Specificity Hook',
    channel: 'linkedin',
    body: `Hey [First Name] —

I noticed you [specific observation — posted about hiring / mentioned a new offer / hit a milestone].

That usually means one of two things is about to happen: either the operation scales with the revenue, or the chaos scales with the revenue.

Which one are you set up for right now?

— Tania | Virtual OPS`,
  },
  {
    id: 'msg-05',
    name: 'The Cash Flow Trigger',
    channel: 'linkedin',
    body: `Hey [First Name] —

Do you know your cash position right now — not your revenue, your actual cash — without having to open three different spreadsheets or call your bookkeeper?

If the answer is no, that's not a you problem. That's a systems problem. And it's one of the most expensive ones a growing business can have.

Worth a conversation?

— Tania`,
  },
  {
    id: 'msg-06',
    name: 'The Hiring Trap',
    channel: 'email',
    subject: 'Before you hire that next person…',
    body: `Hey [First Name],

I'm going to ask something that might be uncomfortable.

Before you bring on your next hire — do you have the systems in place that will make them effective? Or are you about to spend $3,000–$6,000/month on someone who's going to be as confused as you are?

Most founders hire to solve a capacity problem. The real problem is usually a systems problem.

I help fix the systems so that when you hire, the hire actually works.

Is that relevant to where you are right now?

— Tania Potter | Virtual OPS`,
  },
  {
    id: 'msg-07',
    name: 'The Brutal Honest One',
    channel: 'linkedin',
    body: `Hey [First Name] —

I'll be straight with you.

Most founders I talk to are making money and losing money at the same time — revenue up, margins unclear, operations held together manually, and no real visibility into what's actually working.

If that's not you, ignore this.

If it is — I'd love to have a real conversation about what fixing it actually looks like.

— Tania`,
  },
  {
    id: 'msg-08',
    name: 'The Referral Frame',
    channel: 'linkedin',
    body: `Hey [First Name] —

I work with founders helping them get their financial and operational backend under control — the systems, the clarity, the structure that makes growth actually work.

I'm not pitching you. I just genuinely don't know if it's relevant to where you are.

So I'll ask directly: is backend chaos something you're dealing with right now, or have you got that handled?

— Tania | Virtual OPS`,
  },
  {
    id: 'msg-09',
    name: 'The Pattern Interrupt',
    channel: 'instagram',
    body: `Hey [First Name] — love what you're building.

Quick question and you can tell me to mind my business: does your backend match your front end?

Because a lot of founders with great offers and real revenue are running on systems that haven't caught up with the growth.

Just curious if that's something you're thinking about.

— Tania`,
  },
  {
    id: 'msg-10',
    name: 'The Accountant Angle',
    channel: ['linkedin', 'email'],
    body: `Hey [First Name] —

I'm an accountant and an AI architect — which is a weird combination until you understand what I actually do.

I help founders see exactly where their money is going, why their operations are draining it, and how to fix both using AI-powered systems that don't require a full team to run.

Is any of that relevant to where your business is right now?

— Tania Potter | Virtual OPS`,
  },
  {
    id: 'msg-11',
    name: 'The Numbers Reality Check',
    channel: 'email',
    subject: 'Do you know your real numbers?',
    body: `Hey [First Name],

Not your revenue. Your real numbers.

Profit margin per service line. Cost per client acquired. Average client lifetime value. Cash runway.

Most founders generating $10K–$100K/month can't answer all four of those without digging. That gap is expensive — because what you can't see, you can't fix.

I help founders get that clarity — and then build the operational systems to improve those numbers.

Worth a 20-minute conversation?

— Tania | Virtual OPS`,
  },
  {
    id: 'msg-12',
    name: 'The Ops Mirror',
    channel: 'linkedin',
    body: `Hey [First Name] —

If you stepped away from your business for two weeks — completely off the grid — what would break?

Most founders I work with know the answer immediately. And it tells them exactly what needs to be fixed.

I help fix it. Is that a conversation that makes sense right now?

— Tania`,
  },
  {
    id: 'msg-13',
    name: 'The AI Angle',
    channel: ['linkedin', 'email'],
    body: `Hey [First Name] —

Are you using AI in your business operations yet — or is it still more of a "I should probably figure that out" situation?

I ask because most founders at your stage are leaving a significant amount of time and money on the table by not having the right AI systems in place.

Not the hype stuff. Actual operational infrastructure that cuts your manual workload by 30–50%.

Worth talking about?

— Tania | Virtual OPS`,
  },
  {
    id: 'msg-14',
    name: 'The Direct Ask',
    channel: 'linkedin',
    body: `Hey [First Name] —

I'll keep this simple.

I help revenue-generating founders get their financial systems, operational workflows, and AI infrastructure in order so they can scale without chaos.

Does that solve a problem you have right now?

— Tania Potter
Virtual OPS`,
  },
  {
    id: 'msg-15',
    name: 'The Observation Open',
    channel: 'linkedin',
    body: `Hey [First Name] —

I've been following your content for a bit. You clearly know how to generate revenue.

I'm just curious — is the operation keeping up with it? Or is that an area you're still figuring out?

— Tania`,
  },
];

// --- Follow-Up Messages ---
export interface FollowUpMessage {
  id: string;
  name: string;
  dayOffset: number; // days after initial outreach
  switchChannel: boolean;
  subject?: string;
  body: string;
}

export const FOLLOWUP_MESSAGES: FollowUpMessage[] = [
  {
    id: 'fu-01',
    name: 'Day 3 — Nudge',
    dayOffset: 3,
    switchChannel: false,
    body: `Hey [First Name] — just making sure this didn't get buried.

No pressure at all — just genuinely curious if the backend chaos situation is something you're dealing with.

If not, no worries. If yes — worth a quick conversation.

— Tania`,
  },
  {
    id: 'fu-02',
    name: 'Day 6 — Last Thread',
    dayOffset: 6,
    switchChannel: false,
    body: `Hey [First Name] —

I'll make this my last follow-up on this thread.

I work with founders who are generating real revenue but losing ground on the backend — financially and operationally.

If that ever becomes relevant, I'm here.

— Tania | Virtual OPS`,
  },
  {
    id: 'fu-03',
    name: 'Day 10 — Genuine Check-In',
    dayOffset: 10,
    switchChannel: true,
    body: `Hey [First Name] —

Different angle — I'm not trying to sell you anything in this message.

I just want to ask: what's the biggest operational or financial challenge in your business right now? Even if we're not a fit, I might be able to point you in the right direction.

— Tania`,
  },
  {
    id: 'fu-04',
    name: 'Value Drop',
    dayOffset: 14,
    switchChannel: true,
    subject: 'Something that might be useful regardless',
    body: `Hey [First Name],

Regardless of whether we ever work together — here's something worth knowing.

The three most common places revenue-generating businesses lose money without realizing it:

1. Untracked time spent on non-billable operational tasks
2. Client acquisition costs that exceed lifetime client value
3. Manual processes that create errors, delays, and rework

If any of those are happening in your business, they're fixable — and AI makes them significantly cheaper to fix than hiring.

Just thought it was worth sharing.

— Tania | Virtual OPS | virtualopsassist.com`,
  },
  {
    id: 'fu-05',
    name: 'Day 30 — Re-open',
    dayOffset: 30,
    switchChannel: false,
    body: `Hey [First Name] — it's been a minute.

Checking back in. Has anything changed in the business since we last connected?

— Tania`,
  },
];

// --- Follow-up schedule mapping to tags and pipeline stages ---
export const FOLLOWUP_TAG_MAP: Record<string, { nextTag: OutboundTag; stageIndex: number }> = {
  'outreach-sent': { nextTag: 'followup-1-sent', stageIndex: 2 },
  'followup-1-sent': { nextTag: 'followup-2-sent', stageIndex: 3 },
  'followup-2-sent': { nextTag: 'followup-3-sent', stageIndex: 4 },
};

// --- Daily Targets ---
export const DAILY_TARGETS = {
  newOutreach: 20,
  followUps: 10,
  totalTouches: 30,
} as const;

// --- Custom Fields for GHL ---
export const CUSTOM_FIELDS = [
  { name: 'Search Category', dataType: 'TEXT', placeholder: 'e.g. Agency owners' },
  { name: 'Outreach Message ID', dataType: 'TEXT', placeholder: 'e.g. msg-01' },
  { name: 'Outreach Channel', dataType: 'TEXT', placeholder: 'linkedin / email / instagram' },
  { name: 'Outreach Date', dataType: 'DATE', placeholder: '' },
  { name: 'Last Follow-Up ID', dataType: 'TEXT', placeholder: 'e.g. fu-01' },
  { name: 'ICP Score', dataType: 'NUMERICAL', placeholder: '1-10' },
] as const;
