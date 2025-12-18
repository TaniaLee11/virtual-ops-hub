export enum AppView {
  DASHBOARD = 'dashboard',
  INTELLIGENCE = 'intelligence', 
  CONSULTANT = 'consultant',     
  ACADEMY = 'academy',        
  VAULT = 'vault',            
  SETTINGS = 'settings',
  SYSTEMS = 'systems',
  CLIENT_PORTAL = 'client_portal',
  RECONCILIATION = 'reconciliation',
  WIX_DEPLOY = 'wix_deploy'
}

export type ClientContext = 'Fatherhood Connection' | 'REN Ecosystem' | 'Virtual Ops Internal' | 'Direct SaaS Partner';

export type ServiceTier = 'Managed' | 'Direct';

export type MediaType = "image" | "video" | "audio" | "text" | "error" | "pending";

export interface GeneratedMedia {
  id: string;
  type: MediaType;
  title?: string;
  prompt?: string;
  url?: string;
  uri?: string;
  mimeType?: string;
  timestamp: number;
  createdAt: string;
  status?: "ready" | "pending" | "error";
  errorMessage?: string;
  metadata?: Record<string, any>;
  client?: ClientContext;
}

export interface SystemHealth {
  id: string;
  name: string;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync: number;
  category: 'payment' | 'accounting' | 'operations' | 'gig';
  icon: string;
}

export interface BusinessSignal {
  id: string;
  type: 'opportunity' | 'risk' | 'competitor' | 'trend';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  relevance: number;
  timestamp: number;
}

export interface TaskItem {
  id: string;
  client: ClientContext;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  category: string;
  task: string;
  completed: boolean;
  assignedTo: 'Tania' | 'VOPSy' | 'Client';
}

export interface BusinessReport {
  id: string;
  type: 'market_research' | 'swot' | 'competitive' | 'financial' | 'grant_proposal' | 'investment_strategy' | 'hedging_strategy';
  title: string;
  content: string;
  prompt: string;
  timestamp: number;
  sources?: { title: string; uri: string }[];
  isClientFacing?: boolean;
  client?: ClientContext;
}

export interface LMSEpisode {
  id: string;
  title: string;
  description: string;
  script: string;
  videoUrl?: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
}

export interface LMSCourse {
  id: string;
  title: string;
  description: string;
  episodes: LMSEpisode[];
  timestamp: number;
  client?: ClientContext;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
  timestamp: number;
  toolCalls?: any[];
  clientContext?: ClientContext;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  source: string;
  category?: string;
  status: 'pending' | 'reconciled' | 'flagged';
  matchId?: string;
  confidence?: number;
  aiInsight?: string;
}

export interface ReconciliationSummary {
  reconciledPercentage: number;
  unmatchedCount: number;
  flaggedCount: number;
  lastSync: number;
}