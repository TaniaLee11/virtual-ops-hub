/**
 * Outbound Execution Engine
 * Handles message personalization, sequencing, and daily workflow execution.
 * VOPSy triggers this engine via the /api/outbound/execute route.
 */

import {
  OUTREACH_MESSAGES,
  FOLLOWUP_MESSAGES,
  SEARCH_CATEGORIES,
  DAILY_TARGETS,
  FOLLOWUP_TAG_MAP,
  type Channel,
  type OutreachMessage,
  type FollowUpMessage,
} from './config';

// --- Message Personalization ---

export function personalizeMessage(
  template: string,
  data: {
    firstName: string;
    specificObservation?: string;
    profileReference?: string;
  }
): string {
  let message = template;
  message = message.replace(/\[First Name\]/g, data.firstName);
  if (data.specificObservation) {
    message = message.replace(
      /\[specific observation[^\]]*\]/g,
      data.specificObservation
    );
  }
  if (data.profileReference) {
    message = message.replace(
      /\[reference something specific from their profile\]/g,
      data.profileReference
    );
  }
  return message;
}

// --- Message Selection (rotation) ---

export function selectOutreachMessage(
  usedMessageIds: string[],
  preferredChannel: Channel
): OutreachMessage | null {
  const available = OUTREACH_MESSAGES.filter((msg) => {
    if (usedMessageIds.includes(msg.id)) return false;
    const channels = Array.isArray(msg.channel) ? msg.channel : [msg.channel];
    return channels.includes(preferredChannel);
  });

  if (available.length === 0) {
    // Fall back to any unused message
    const fallback = OUTREACH_MESSAGES.filter(
      (msg) => !usedMessageIds.includes(msg.id)
    );
    return fallback.length > 0 ? fallback[0] : null;
  }

  // Random selection from available pool
  return available[Math.floor(Math.random() * available.length)];
}

// --- Follow-Up Selection ---

export function getFollowUpForDay(daysSinceOutreach: number): FollowUpMessage | null {
  return (
    FOLLOWUP_MESSAGES.find((fu) => fu.dayOffset === daysSinceOutreach) || null
  );
}

export function getFollowUpByIndex(index: number): FollowUpMessage | null {
  return FOLLOWUP_MESSAGES[index] || null;
}

// --- Search Category Rotation ---

export function getTodaySearchCategory(lastCategoryIndex: number): {
  category: string;
  index: number;
} {
  let nextIndex = (lastCategoryIndex + 1) % SEARCH_CATEGORIES.length;
  return {
    category: SEARCH_CATEGORIES[nextIndex],
    index: nextIndex,
  };
}

// --- Daily Execution Summary ---

export interface DailyExecutionResult {
  date: string;
  searchCategory: string;
  newOutreachSent: number;
  followUpsSent: number;
  totalTouches: number;
  responsesReceived: number;
  conversationsOpened: number;
  callsBooked: number;
  contacts: {
    contactId: string;
    name: string;
    action: 'outreach' | 'followup-1' | 'followup-2' | 'followup-3' | 'response-flagged';
    messageId: string;
    channel: Channel;
    timestamp: string;
  }[];
  errors: string[];
}

export function createEmptyResult(searchCategory: string): DailyExecutionResult {
  return {
    date: new Date().toISOString().split('T')[0],
    searchCategory,
    newOutreachSent: 0,
    followUpsSent: 0,
    totalTouches: 0,
    responsesReceived: 0,
    conversationsOpened: 0,
    callsBooked: 0,
    contacts: [],
    errors: [],
  };
}

// --- Follow-Up Tag Progression ---

export function getNextFollowUpTag(currentTag: string): {
  nextTag: string;
  stageIndex: number;
} | null {
  return FOLLOWUP_TAG_MAP[currentTag] || null;
}

// --- Channel Selection ---

export function selectChannel(contact: {
  linkedinUrl?: string;
  email?: string;
  instagramHandle?: string;
}): Channel {
  if (contact.linkedinUrl) return 'linkedin';
  if (contact.email) return 'email';
  if (contact.instagramHandle) return 'instagram';
  return 'email'; // fallback
}

// --- Validation ---

export function hasUnfilledBrackets(message: string): boolean {
  return /\[[^\]]+\]/.test(message);
}

export function validatePersonalization(message: string): {
  valid: boolean;
  missingFields: string[];
} {
  const brackets = message.match(/\[[^\]]+\]/g) || [];
  return {
    valid: brackets.length === 0,
    missingFields: brackets.map((b) => b.slice(1, -1)),
  };
}

// --- Rate Limiting ---

export function isWithinDailyLimits(
  outreachSent: number,
  followUpsSent: number
): boolean {
  return (
    outreachSent < DAILY_TARGETS.newOutreach &&
    outreachSent + followUpsSent < DAILY_TARGETS.totalTouches
  );
}

export function remainingCapacity(
  outreachSent: number,
  followUpsSent: number
): { outreach: number; followUps: number; total: number } {
  const totalUsed = outreachSent + followUpsSent;
  return {
    outreach: Math.max(0, DAILY_TARGETS.newOutreach - outreachSent),
    followUps: Math.max(0, DAILY_TARGETS.followUps - followUpsSent),
    total: Math.max(0, DAILY_TARGETS.totalTouches - totalUsed),
  };
}
