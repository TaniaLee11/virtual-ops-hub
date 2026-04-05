/**
 * GoHighLevel API Client for Virtual OPS Hub
 * Handles contacts, pipelines, tags, and messaging
 */

const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

interface GHLConfig {
  apiKey: string;
  locationId: string;
}

function getConfig(): GHLConfig {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    throw new Error('GHL_API_KEY and GHL_LOCATION_ID must be set in environment variables');
  }
  return { apiKey, locationId };
}

function headers(): Record<string, string> {
  const { apiKey } = getConfig();
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };
}

async function ghlFetch(path: string, options: RequestInit = {}) {
  const url = `${GHL_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers(), ...(options.headers as Record<string, string> || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GHL API error ${res.status}: ${body}`);
  }
  return res.json();
}

// --- Contacts ---

export interface GHLContact {
  id?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  tags?: string[];
  customFields?: { id: string; value: string }[];
  source?: string;
}

export async function createContact(contact: GHLContact) {
  const { locationId } = getConfig();
  return ghlFetch('/contacts/', {
    method: 'POST',
    body: JSON.stringify({ ...contact, locationId }),
  });
}

export async function updateContact(contactId: string, data: Partial<GHLContact>) {
  return ghlFetch(`/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function addTagsToContact(contactId: string, tags: string[]) {
  return ghlFetch(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tags }),
  });
}

export async function removeTagsFromContact(contactId: string, tags: string[]) {
  return ghlFetch(`/contacts/${contactId}/tags`, {
    method: 'DELETE',
    body: JSON.stringify({ tags }),
  });
}

export async function searchContacts(query: string) {
  const { locationId } = getConfig();
  return ghlFetch(`/contacts/search/duplicate?locationId=${locationId}&${query}`);
}

export async function getContactsByTag(tag: string) {
  const { locationId } = getConfig();
  return ghlFetch(
    `/contacts/?locationId=${locationId}&query=${encodeURIComponent(tag)}&limit=100`
  );
}

// --- Pipelines ---

export interface GHLPipelineStage {
  name: string;
  position: number;
}

export async function createPipeline(name: string, stages: GHLPipelineStage[]) {
  const { locationId } = getConfig();
  return ghlFetch('/opportunities/pipelines', {
    method: 'POST',
    body: JSON.stringify({ locationId, name, stages }),
  });
}

export async function getPipelines() {
  const { locationId } = getConfig();
  return ghlFetch(`/opportunities/pipelines?locationId=${locationId}`);
}

// --- Opportunities ---

export async function createOpportunity(data: {
  pipelineId: string;
  stageId: string;
  contactId: string;
  name: string;
  status?: string;
  monetaryValue?: number;
}) {
  return ghlFetch('/opportunities/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOpportunityStage(
  opportunityId: string,
  pipelineId: string,
  stageId: string
) {
  return ghlFetch(`/opportunities/${opportunityId}`, {
    method: 'PUT',
    body: JSON.stringify({ pipelineId, stageId }),
  });
}

export async function getOpportunities(pipelineId: string) {
  const { locationId } = getConfig();
  return ghlFetch(
    `/opportunities/search?location_id=${locationId}&pipeline_id=${pipelineId}`
  );
}

// --- Tags ---

export async function createTag(name: string) {
  const { locationId } = getConfig();
  return ghlFetch('/tags/', {
    method: 'POST',
    body: JSON.stringify({ name, locationId }),
  });
}

export async function getTags() {
  const { locationId } = getConfig();
  return ghlFetch(`/tags/?locationId=${locationId}`);
}

// --- Conversations / Messages ---

export async function sendEmail(data: {
  contactId: string;
  subject: string;
  body: string;
  emailFrom?: string;
}) {
  return ghlFetch('/conversations/messages', {
    method: 'POST',
    body: JSON.stringify({
      type: 'Email',
      contactId: data.contactId,
      subject: data.subject,
      body: data.body,
      emailFrom: data.emailFrom || 'tania@virtualopsassist.com',
    }),
  });
}

export async function sendSMS(data: { contactId: string; body: string }) {
  return ghlFetch('/conversations/messages', {
    method: 'POST',
    body: JSON.stringify({
      type: 'SMS',
      contactId: data.contactId,
      body: data.body,
    }),
  });
}

// --- Custom Fields ---

export async function getCustomFields() {
  const { locationId } = getConfig();
  return ghlFetch(`/locations/${locationId}/customFields`);
}

export async function createCustomField(data: {
  name: string;
  dataType: string;
  placeholder?: string;
}) {
  const { locationId } = getConfig();
  return ghlFetch(`/locations/${locationId}/customFields`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
