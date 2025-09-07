/*
# Trendy Cash Platform - Initial Database Schema
This migration creates the complete database structure for the Trendy Cash earning platform including user profiles, subscriptions, trivia, articles, referrals, transactions, and admin management.

## Query Description: 
This operation creates the foundational database schema for a modern earning platform. It establishes user management, subscription system, content management (trivia/articles), referral tracking, payment processing, and administrative controls. No existing data will be affected as this is the initial schema creation.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- User profiles linked to auth.users
- Subscription management with plans and user subscriptions
- Content management for trivia questions and articles
- Referral system with tracking and earnings
- Transaction management for deposits/withdrawals
- Payment methods and site settings
- Admin management system

## Security Implications:
- RLS Status: Enabled on all public tables
- Policy Changes: Yes (comprehensive RLS policies)
- Auth Requirements: Integration with Supabase Auth

## Performance Impact:
- Indexes: Added for optimal query performance
- Triggers: User profile auto-creation
- Estimated Impact: Minimal (new schema)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'expired')),
    current_plan_id UUID,
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    available_balance DECIMAL(10,2) DEFAULT 0.00,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Plans Table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plans(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    payment_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trivia Categories Table
CREATE TABLE public.trivia_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trivia Questions Table
CREATE TABLE public.trivia_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.trivia_categories(id),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    points INTEGER DEFAULT 10,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Trivia Attempts Table
CREATE TABLE public.trivia_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.trivia_questions(id),
    selected_answer INTEGER,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles Table
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    featured_image TEXT,
    reading_time INTEGER, -- in minutes
    points_reward INTEGER DEFAULT 5,
    is_published BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Article Reads Table
CREATE TABLE public.article_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.articles(id),
    points_earned INTEGER DEFAULT 0,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- Referrals Table
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- percentage
    commission_earned DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Transactions Table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'earnings', 'referral_bonus', 'subscription_payment')),
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    description TEXT,
    reference_id TEXT,
    payment_method_id UUID,
    admin_notes TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Payment Methods Table
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'mobile_money', 'paypal')),
    details JSONB NOT NULL, -- Bank details, mobile number, etc.
    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'number', 'boolean', 'json')),
    description TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Activities Table
CREATE TABLE public.admin_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT, -- user, trivia, article, etc.
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_trivia_attempts_user_id ON public.trivia_attempts(user_id);
CREATE INDEX idx_article_reads_user_id ON public.article_reads(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN := TRUE;
BEGIN
    WHILE exists LOOP
        code := 'TC' || LPAD(floor(random() * 1000000)::text, 6, '0');
        SELECT COUNT(*) > 0 INTO exists FROM public.profiles WHERE referral_code = code;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.type IN ('earnings', 'referral_bonus') THEN
        UPDATE public.profiles 
        SET available_balance = available_balance + NEW.amount,
            total_earnings = total_earnings + NEW.amount
        WHERE id = NEW.user_id;
    ELSIF NEW.status = 'approved' AND NEW.type = 'withdrawal' THEN
        UPDATE public.profiles 
        SET available_balance = available_balance - NEW.amount
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create user profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, referral_code)
    VALUES (NEW.id, NEW.email, generate_referral_code());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create trigger for balance updates
CREATE TRIGGER update_balance_trigger
    AFTER UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_balance();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price, duration_days, features) VALUES
('Basic Plan', 'Access to basic earning features', 500.00, 30, '{"trivia_limit": 10, "article_reads": 5, "referral_commission": 5}'),
('Premium Plan', 'Enhanced earning opportunities', 1000.00, 30, '{"trivia_limit": 25, "article_reads": 15, "referral_commission": 10}'),
('VIP Plan', 'Unlimited access to all features', 2000.00, 30, '{"trivia_limit": -1, "article_reads": -1, "referral_commission": 15}');

-- Insert default trivia categories
INSERT INTO public.trivia_categories (name, description) VALUES
('General Knowledge', 'General knowledge questions'),
('Science & Technology', 'Questions about science and technology'),
('Sports', 'Sports-related questions'),
('Entertainment', 'Movies, music, and entertainment'),
('History', 'Historical events and figures');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, type, description) VALUES
('site_name', 'Trendy Cash', 'text', 'Website name'),
('default_currency', 'KES', 'text', 'Default currency code'),
('min_withdrawal_amount', '100', 'number', 'Minimum withdrawal amount'),
('referral_commission_rate', '10', 'number', 'Default referral commission percentage'),
('trivia_points_per_question', '10', 'number', 'Points earned per correct trivia answer'),
('article_reading_points', '5', 'number', 'Points earned for reading an article');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Subscription plans policies (public read)
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Trivia categories policies (public read)
CREATE POLICY "Anyone can view active trivia categories" ON public.trivia_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage trivia categories" ON public.trivia_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Trivia questions policies
CREATE POLICY "Authenticated users can view active trivia questions" ON public.trivia_questions
    FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Admins can manage trivia questions" ON public.trivia_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Trivia attempts policies
CREATE POLICY "Users can view their own trivia attempts" ON public.trivia_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trivia attempts" ON public.trivia_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all trivia attempts" ON public.trivia_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Articles policies
CREATE POLICY "Anyone can view published articles" ON public.articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all articles" ON public.articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Article reads policies
CREATE POLICY "Users can view their own article reads" ON public.article_reads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own article reads" ON public.article_reads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view their referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals" ON public.referrals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all referrals" ON public.referrals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawal requests" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id AND type = 'withdrawal');

CREATE POLICY "Admins can manage all transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Payment methods policies
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- Site settings policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Admin activities policies
CREATE POLICY "Admins can view admin activities" ON public.admin_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Admins can insert admin activities" ON public.admin_activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        ) AND auth.uid() = admin_id
    );
