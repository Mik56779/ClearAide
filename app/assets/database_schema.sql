-- Database Schema for Accessible Tax & Insurance Application

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE filing_status AS ENUM ('single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household', 'qualifying_widow');
CREATE TYPE insurance_status AS ENUM ('uninsured', 'employer', 'marketplace', 'medicaid', 'medicare', 'other');
CREATE TYPE application_status AS ENUM ('draft', 'in_progress', 'submitted', 'approved', 'rejected', 'completed');

-- Users profile table (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    ssn_encrypted TEXT, -- Encrypted SSN for tax purposes
    accessibility_preferences JSONB DEFAULT '{}', -- Store TTS/STT preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax filing information
CREATE TABLE public.tax_filings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tax_year INTEGER NOT NULL,
    filing_status filing_status NOT NULL,
    status application_status DEFAULT 'draft',
    
    -- Personal Information
    spouse_first_name TEXT,
    spouse_last_name TEXT,
    spouse_ssn_encrypted TEXT,
    
    -- Income Information
    w2_income DECIMAL(12,2) DEFAULT 0,
    self_employment_income DECIMAL(12,2) DEFAULT 0,
    unemployment_income DECIMAL(12,2) DEFAULT 0,
    social_security_income DECIMAL(12,2) DEFAULT 0,
    retirement_income DECIMAL(12,2) DEFAULT 0,
    other_income DECIMAL(12,2) DEFAULT 0,
    
    -- Deductions
    standard_deduction BOOLEAN DEFAULT TRUE,
    itemized_deductions DECIMAL(12,2) DEFAULT 0,
    charitable_donations DECIMAL(12,2) DEFAULT 0,
    mortgage_interest DECIMAL(12,2) DEFAULT 0,
    state_local_taxes DECIMAL(12,2) DEFAULT 0,
    
    -- Dependents
    dependents JSONB DEFAULT '[]', -- Array of dependent information
    
    -- Calculated fields
    total_income DECIMAL(12,2) DEFAULT 0,
    taxable_income DECIMAL(12,2) DEFAULT 0,
    tax_owed DECIMAL(12,2) DEFAULT 0,
    refund_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health insurance applications
CREATE TABLE public.health_insurance_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    application_year INTEGER NOT NULL,
    status application_status DEFAULT 'draft',
    
    -- Household Information
    household_size INTEGER NOT NULL DEFAULT 1,
    household_members JSONB DEFAULT '[]', -- Array of household member information
    
    -- Income Information
    annual_household_income DECIMAL(12,2) NOT NULL DEFAULT 0,
    income_sources JSONB DEFAULT '[]', -- Array of income source details
    
    -- Current Insurance Status
    current_insurance_status insurance_status,
    current_insurance_details JSONB DEFAULT '{}',
    
    -- Coverage Preferences
    preferred_plan_type TEXT, -- Bronze, Silver, Gold, Platinum
    preferred_deductible_range TEXT,
    preferred_monthly_premium_range TEXT,
    
    -- Special Circumstances
    has_disabilities BOOLEAN DEFAULT FALSE,
    disability_details TEXT,
    needs_special_accommodations BOOLEAN DEFAULT FALSE,
    accommodation_details TEXT,
    
    -- Eligibility Results
    medicaid_eligible BOOLEAN,
    marketplace_eligible BOOLEAN,
    premium_tax_credit_eligible BOOLEAN,
    estimated_premium_tax_credit DECIMAL(12,2),
    
    -- Selected Plan
    selected_plan_id TEXT,
    selected_plan_details JSONB DEFAULT '{}',
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document storage references
CREATE TABLE public.user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'w2', 'tax_return', 'insurance_card', etc.
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase storage path
    file_size INTEGER,
    mime_type TEXT,
    related_application_id UUID, -- Can reference tax_filings or health_insurance_applications
    related_application_type TEXT, -- 'tax_filing' or 'health_insurance'
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accessibility settings and preferences
CREATE TABLE public.accessibility_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- TTS Settings
    tts_enabled BOOLEAN DEFAULT FALSE,
    tts_voice TEXT DEFAULT 'default',
    tts_speed DECIMAL(3,2) DEFAULT 1.0,
    tts_volume DECIMAL(3,2) DEFAULT 1.0,
    
    -- STT Settings
    stt_enabled BOOLEAN DEFAULT FALSE,
    stt_language TEXT DEFAULT 'en-US',
    stt_auto_punctuation BOOLEAN DEFAULT TRUE,
    
    -- Visual Settings
    high_contrast_mode BOOLEAN DEFAULT FALSE,
    large_text_mode BOOLEAN DEFAULT FALSE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    
    -- Navigation Settings
    keyboard_navigation_hints BOOLEAN DEFAULT TRUE,
    screen_reader_optimized BOOLEAN DEFAULT FALSE,
    
    -- Notification Settings
    audio_notifications BOOLEAN DEFAULT TRUE,
    visual_notifications BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- User profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tax filings
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tax filings" ON public.tax_filings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tax filings" ON public.tax_filings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tax filings" ON public.tax_filings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tax filings" ON public.tax_filings FOR DELETE USING (auth.uid() = user_id);

-- Health insurance applications
ALTER TABLE public.health_insurance_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insurance applications" ON public.health_insurance_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own insurance applications" ON public.health_insurance_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insurance applications" ON public.health_insurance_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own insurance applications" ON public.health_insurance_applications FOR DELETE USING (auth.uid() = user_id);

-- User documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON public.user_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.user_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.user_documents FOR DELETE USING (auth.uid() = user_id);

-- Accessibility settings
ALTER TABLE public.accessibility_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own accessibility settings" ON public.accessibility_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own accessibility settings" ON public.accessibility_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accessibility settings" ON public.accessibility_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.accessibility_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tax_filings_updated_at BEFORE UPDATE ON public.tax_filings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_insurance_applications_updated_at BEFORE UPDATE ON public.health_insurance_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accessibility_settings_updated_at BEFORE UPDATE ON public.accessibility_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();