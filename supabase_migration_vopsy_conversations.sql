-- Create vopsy_conversations table to store chat history
CREATE TABLE IF NOT EXISTS public.vopsy_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
  message_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_vopsy_conversations_user_id ON public.vopsy_conversations(user_id);

-- Create index on organization_id for faster queries
CREATE INDEX IF NOT EXISTS idx_vopsy_conversations_organization_id ON public.vopsy_conversations(organization_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_vopsy_conversations_created_at ON public.vopsy_conversations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.vopsy_conversations ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own conversations
CREATE POLICY "Users can view their own conversations"
  ON public.vopsy_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own conversations
CREATE POLICY "Users can insert their own conversations"
  ON public.vopsy_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own conversations
CREATE POLICY "Users can update their own conversations"
  ON public.vopsy_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own conversations
CREATE POLICY "Users can delete their own conversations"
  ON public.vopsy_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create vopsy_audit_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.vopsy_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  tool_name TEXT,
  data_touched TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on user_id for audit log
CREATE INDEX IF NOT EXISTS idx_vopsy_audit_log_user_id ON public.vopsy_audit_log(user_id);

-- Create index on organization_id for audit log
CREATE INDEX IF NOT EXISTS idx_vopsy_audit_log_organization_id ON public.vopsy_audit_log(organization_id);

-- Enable Row Level Security on audit log
ALTER TABLE public.vopsy_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
  ON public.vopsy_audit_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
  ON public.vopsy_audit_log
  FOR INSERT
  WITH CHECK (true);
