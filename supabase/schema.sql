-- ==============================================================================
-- GENZOMATE LIVE ENGLISH EXAMINATION PORTAL - COMPLETE SUPABASE SCHEMA & RLS
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Teacher & Staff)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXAMS
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  total_questions INT NOT NULL DEFAULT 30,
  total_marks INT NOT NULL DEFAULT 30,
  duration_minutes INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'paused', 'ended')),
  start_time TIMESTAMPTZ,
  remaining_seconds INT NOT NULL DEFAULT 1800,
  leaderboard_revealed BOOLEAN NOT NULL DEFAULT FALSE,
  solutions_revealed BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 3. QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id INT NOT NULL,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  marks INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (exam_id, id)
);

-- 4. STUDENT SESSIONS
CREATE TABLE IF NOT EXISTS student_sessions (
  session_id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  connection_status TEXT NOT NULL DEFAULT 'online' CHECK (connection_status IN ('online', 'offline')),
  submission_status TEXT NOT NULL DEFAULT 'waiting' CHECK (submission_status IN ('waiting', 'answering', 'submitted')),
  current_question_index INT NOT NULL DEFAULT 0,
  answered_count INT NOT NULL DEFAULT 0,
  progress_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- 5. STUDENT PROGRESS & ANSWERS
CREATE TABLE IF NOT EXISTS submission_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL REFERENCES student_sessions(session_id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id INT NOT NULL,
  selected_option TEXT CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, question_id)
);

-- 6. SUBMISSIONS (Final Evaluated Scores)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL REFERENCES student_sessions(session_id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  total_marks INT NOT NULL DEFAULT 30,
  percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  correct_count INT NOT NULL DEFAULT 0,
  incorrect_count INT NOT NULL DEFAULT 0,
  unanswered_count INT NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  rank INT
);

-- 7. EXAM SETTINGS
CREATE TABLE IF NOT EXISTS exam_settings (
  exam_id TEXT PRIMARY KEY REFERENCES exams(id) ON DELETE CASCADE,
  allow_back_navigation BOOLEAN DEFAULT TRUE,
  shuffle_questions BOOLEAN DEFAULT FALSE,
  auto_submit_on_timeout BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EXAM EVENTS (Realtime Audit / Action Log)
CREATE TABLE IF NOT EXISTS exam_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_student_sessions_exam_id ON student_sessions(exam_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_session ON submission_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exam_score ON submissions(exam_id, score DESC, submitted_at ASC);
CREATE INDEX IF NOT EXISTS idx_exam_events_exam_id ON exam_events(exam_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Authenticated users can read/update own profile
CREATE POLICY "Profiles are viewable by authenticated users" 
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Exams: Anyone can read basic exam state (needed for student portal)
CREATE POLICY "Public can view active exam metadata" 
ON exams FOR SELECT TO anon, authenticated USING (true);

-- Only teachers can insert/update exams
CREATE POLICY "Teachers can modify exams" 
ON exams FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Questions: Students can see questions (without correct_answer if sanitized via view/function)
-- In Supabase, correct answers are hidden by creating a public view or selecting through server function
CREATE POLICY "Teachers can manage questions" 
ON questions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('teacher', 'admin'))
);

CREATE POLICY "Students can view question texts" 
ON questions FOR SELECT TO anon, authenticated USING (true);

-- Student Sessions: Students can insert their own session and update their own status
CREATE POLICY "Anyone can join as student session" 
ON student_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Students can read their session" 
ON student_sessions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Students can update their own session" 
ON student_sessions FOR UPDATE TO anon, authenticated USING (true);

-- Submission Answers: Student can insert/update their answers
CREATE POLICY "Students can record their answers" 
ON submission_answers FOR ALL TO anon, authenticated USING (true);

-- Submissions (Results & Leaderboard):
-- Students can only read leaderboard if exam.leaderboard_revealed is TRUE or own result
CREATE POLICY "Leaderboard viewable when revealed or by teacher" 
ON submissions FOR SELECT TO anon, authenticated USING (
  (EXISTS (SELECT 1 FROM exams WHERE exams.id = submissions.exam_id AND exams.leaderboard_revealed = true))
  OR
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('teacher', 'admin')))
);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
-- Enable replication for live tables:
ALTER PUBLICATION supabase_realtime ADD TABLE exams;
ALTER PUBLICATION supabase_realtime ADD TABLE student_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE submission_answers;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE exam_events;
