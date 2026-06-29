-- File path: /db/schema.sql
-- Purpose: Complete PostgreSQL database schema for EthioDomestic (FIXED VERSION)

-- =====================================================
-- 1. EXTENSIONS & TRIGGERS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 2. ENUMS
-- =====================================================

CREATE TYPE admin_role AS ENUM ('super_admin', 'verification_admin', 'finance_admin', 'office_staff');
CREATE TYPE worker_type AS ENUM ('maid', 'guard', 'nanny', 'cook', 'driver', 'cleaner');
CREATE TYPE education_level AS ENUM ('none', 'basic_literacy', 'primary', 'some_secondary', 'secondary', 'certificate', 'university');
CREATE TYPE availability_type AS ENUM ('full_time', 'part_time', 'live_in', 'live_out');
CREATE TYPE registration_status AS ENUM ('draft', 'payment_pending', 'approved', 'verified', 'suspended', 'rejected');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'filled', 'closed', 'cancelled');
CREATE TYPE schedule_type AS ENUM ('full_time', 'part_time');
CREATE TYPE housing_type AS ENUM ('live_in', 'live_out');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'interviewed', 'trial', 'hired', 'rejected', 'withdrawn');
CREATE TYPE payment_type AS ENUM ('registration', 'commission', 'urgent_hire', 'office_service', 'collateral');
CREATE TYPE payment_method AS ENUM ('telebirr', 'bank_transfer', 'cash', 'office_cash');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'refunded');
CREATE TYPE report_category AS ENUM ('no_show', 'false_information', 'unprofessional', 'theft', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- =====================================================
-- 3. CORE TABLES
-- =====================================================

-- ADMINS
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role admin_role NOT NULL DEFAULT 'office_staff',
  telegram_chat_id VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- WORKERS (FIXED - removed problematic generated column)
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 70),
  gender VARCHAR(20) NOT NULL,
  photo_url VARCHAR(500),
  emergency_contact_name VARCHAR(255) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  emergency_contact_relationship VARCHAR(100) NOT NULL,
  zone VARCHAR(100),
  woreda VARCHAR(100),
  worker_type worker_type NOT NULL,
  education_level education_level DEFAULT 'none',
  years_experience INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  availability availability_type,
  salary_expectation_min INTEGER,
  salary_expectation_max INTEGER,
  previous_employers JSONB DEFAULT '[]',
  verification_status registration_status DEFAULT 'draft',
  police_clearance_url VARCHAR(500),
  health_certificate_url VARCHAR(500),
  health_certificate_expiry DATE,
  id_document_url VARCHAR(500),
  id_document_type VARCHAR(50),
  id_document_number VARCHAR(100),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES admins(id),
  trust_score JSONB DEFAULT '{"total": 0, "tier": "new", "breakdown": {}}',
  collateral_amount INTEGER DEFAULT 0,
  collateral_status VARCHAR(50) DEFAULT 'none',
  registration_status registration_status DEFAULT 'draft',
  registration_source VARCHAR(50) DEFAULT 'online',
  office_reference VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_blacklisted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_workers_phone ON workers(phone);
CREATE INDEX idx_workers_worker_type ON workers(worker_type);
CREATE INDEX idx_workers_verification_status ON workers(verification_status);
CREATE INDEX idx_workers_zone ON workers(zone);

-- EMPLOYERS
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  zone VARCHAR(100),
  woreda VARCHAR(100),
  household_size INTEGER DEFAULT 1,
  children_under_5 INTEGER DEFAULT 0,
  children_5_to_12 INTEGER DEFAULT 0,
  elderly_members INTEGER DEFAULT 0,
  has_special_needs BOOLEAN DEFAULT false,
  special_notes TEXT,
  registration_status registration_status DEFAULT 'draft',
  registration_source VARCHAR(50) DEFAULT 'online',
  office_reference VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON employers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_employers_phone ON employers(phone);

-- JOBS
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  worker_type worker_type NOT NULL,
  schedule schedule_type NOT NULL,
  housing housing_type NOT NULL,
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  working_hours VARCHAR(100),
  preferred_gender VARCHAR(20) DEFAULT 'any',
  min_experience INTEGER DEFAULT 0,
  min_education education_level,
  required_skills TEXT[] DEFAULT '{}',
  is_urgent BOOLEAN DEFAULT false,
  urgent_expires_at TIMESTAMPTZ,
  status job_status DEFAULT 'draft',
  filled_at TIMESTAMPTZ,
  filled_by_worker_id UUID REFERENCES workers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);

-- APPLICATIONS
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  status application_status DEFAULT 'applied',
  trial_start_date DATE,
  trial_end_date DATE,
  hired_at TIMESTAMPTZ,
  agreed_salary INTEGER,
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_worker_id ON applications(worker_id);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payer_type VARCHAR(20) NOT NULL,
  payer_id UUID NOT NULL,
  payment_type payment_type NOT NULL,
  reference_id UUID,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'ETB',
  method payment_method,
  transaction_reference VARCHAR(255),
  receipt_url VARCHAR(500),
  status payment_status DEFAULT 'pending',
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES admins(id),
  office_receipt_number VARCHAR(50),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_payments_payer ON payments(payer_type, payer_id);
CREATE INDEX idx_payments_status ON payments(status);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  context_tags TEXT[] DEFAULT '{}',
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, employer_id, application_id)
);

-- REPORTS
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_worker_id UUID NOT NULL REFERENCES workers(id),
  reporting_employer_id UUID NOT NULL REFERENCES employers(id),
  category report_category NOT NULL,
  description TEXT,
  status report_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES admins(id),
  admin_notes TEXT,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type VARCHAR(20) NOT NULL,
  user_id UUID NOT NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_type, user_id);

-- BLACKLIST
CREATE TABLE blacklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20),
  id_document_number VARCHAR(100),
  full_name VARCHAR(255),
  photo_url VARCHAR(500),
  reason TEXT NOT NULL,
  category VARCHAR(100),
  blacklisted_by UUID REFERENCES admins(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLATFORM SETTINGS
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  value_type VARCHAR(50) NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admins(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VERIFICATION LOGS
CREATE TABLE verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  check_type VARCHAR(100) NOT NULL,
  reference_contact_phone VARCHAR(20),
  result VARCHAR(50) NOT NULL,
  notes TEXT,
  checked_by UUID REFERENCES admins(id),
  checked_at TIMESTAMPTZ DEFAULT NOW()
);