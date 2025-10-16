-- Supabase Database Schema for AI Legal Mate

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'lawyer', 'admin'
  avatar_url TEXT,
  device_token TEXT, -- For push notifications
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  case_type VARCHAR(100), -- 'criminal', 'civil', 'corporate', 'family', etc.
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'closed'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  progress INTEGER DEFAULT 0, -- 0-100 percentage
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for cases table
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_path TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  document_type VARCHAR(100), -- 'contract', 'agreement', 'complaint', 'evidence', etc.
  description TEXT,
  content TEXT, -- For text content that isn't stored as a file
  encryption_key TEXT, -- If document is encrypted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for documents table
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);

-- AI Interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  model_used VARCHAR(100) DEFAULT 'gpt-4-turbo-preview',
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for AI interactions table
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);

-- Contract Analyses table
CREATE TABLE IF NOT EXISTS contract_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contract_text TEXT NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for contract analyses table
CREATE INDEX IF NOT EXISTS idx_contract_analyses_user_id ON contract_analyses(user_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  description TEXT,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for payments table
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lawyer_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Lawyer providing consultation
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 60, -- Duration in minutes
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  payment_id UUID REFERENCES payments(id),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for consultations table
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_at ON consultations(scheduled_at);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(100), -- 'case_update', 'deadline_reminder', 'payment', etc.
  read_status BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(read_status);

-- Legal Education Modules table
CREATE TABLE IF NOT EXISTS education_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100), -- 'basics', 'contracts', 'corporate', 'family', etc.
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  duration INTEGER, -- Estimated duration in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Education Progress table
CREATE TABLE IF NOT EXISTS user_education_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES education_modules(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  score INTEGER, -- For quizzes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Index for user education progress
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_module_id ON user_education_progress(module_id);

-- Community Q&A table
CREATE TABLE IF NOT EXISTS community_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[], -- Array of tags
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'answered', 'closed'
  views INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for community questions
CREATE INDEX IF NOT EXISTS idx_community_questions_user_id ON community_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_questions_status ON community_questions(status);
CREATE INDEX IF NOT EXISTS idx_community_questions_category ON community_questions(category);

-- Community Answers table
CREATE TABLE IF NOT EXISTS community_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for community answers
CREATE INDEX IF NOT EXISTS idx_community_answers_question_id ON community_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_community_answers_user_id ON community_answers(user_id);

-- Legal Templates table
CREATE TABLE IF NOT EXISTS legal_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  template_type VARCHAR(100), -- 'contract', 'letter', 'complaint', etc.
  category VARCHAR(100), -- 'business', 'personal', 'employment', etc.
  jurisdiction VARCHAR(100) DEFAULT 'Indonesia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Legal Document Generations table
CREATE TABLE IF NOT EXISTS user_document_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES legal_templates(id) ON DELETE CASCADE,
  parameters JSONB, -- Parameters used to customize the template
  generated_document TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user document generations
CREATE INDEX IF NOT EXISTS idx_user_doc_gen_user_id ON user_document_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_doc_gen_template_id ON user_document_generations(template_id);

-- Triggers to update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables that have an 'updated_at' column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_modules_updated_at BEFORE UPDATE ON education_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_education_progress_updated_at BEFORE UPDATE ON user_education_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_document_generations ENABLE ROW LEVEL SECURITY;

-- Policies for users table (users can only see their own data, admins can see all)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id OR auth.role() = 'service_role');

-- Policies for cases table
CREATE POLICY "Users can view own cases" ON cases
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own cases" ON cases
    FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can update own cases" ON cases
    FOR UPDATE USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own cases" ON cases
    FOR DELETE USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for documents table
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own documents" ON documents
    FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own documents" ON documents
    FOR DELETE USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for payments table
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for consultations table
CREATE POLICY "Users can view own consultations" ON consultations
    FOR SELECT USING (user_id = auth.uid() OR lawyer_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for notifications table
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for user_education_progress table
CREATE POLICY "Users can view own education progress" ON user_education_progress
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own education progress" ON user_education_progress
    FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for community_questions table
CREATE POLICY "Users can view all community questions" ON community_questions
    FOR SELECT USING (auth.role() = 'service_role' OR true); -- Allow all authenticated users to view

CREATE POLICY "Users can insert own community questions" ON community_questions
    FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for community_answers table
CREATE POLICY "Users can view all community answers" ON community_answers
    FOR SELECT USING (auth.role() = 'service_role' OR true); -- Allow all authenticated users to view

CREATE POLICY "Users can insert own community answers" ON community_answers
    FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

-- Policies for user_document_generations table
CREATE POLICY "Users can view own document generations" ON user_document_generations
    FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');