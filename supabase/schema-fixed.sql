-- Linkist NFC E-commerce Database Schema
-- Supabase PostgreSQL (Fixed for regular user permissions)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: auth.uid_claim is already set by Supabase, no need to set it manually

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    is_founder_member BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- NFC Card Configurations
CREATE TABLE public.card_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    card_type TEXT NOT NULL DEFAULT 'standard',
    -- Personal Info
    full_name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    -- Social Links
    linkedin_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    -- Design
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#FFFFFF',
    logo_url TEXT,
    photo_url TEXT,
    background_style TEXT DEFAULT 'gradient',
    -- QR Code
    qr_code_data TEXT,
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    card_config_id UUID REFERENCES public.card_configs(id),
    -- Order Details
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    -- Status
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid',
    production_status TEXT DEFAULT 'waiting',
    shipping_status TEXT DEFAULT 'not_shipped',
    -- Stripe
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    produced_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Shipping Addresses
CREATE TABLE public.shipping_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id),
    user_id UUID REFERENCES public.profiles(id),
    -- Address
    full_name TEXT NOT NULL,
    company TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state_province TEXT,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    -- Metadata
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Payment Records
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id),
    user_id UUID REFERENCES public.profiles(id),
    -- Payment Info
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL,
    method TEXT,
    -- Stripe
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_charge_id TEXT,
    stripe_receipt_url TEXT,
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Card Assets (uploaded files)
CREATE TABLE public.card_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    card_config_id UUID REFERENCES public.card_configs(id),
    -- File Info
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    file_url TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- 'logo', 'photo', 'background'
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- OTP Verification (for guest checkout)
CREATE TABLE public.otp_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Admin Settings
CREATE TABLE public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_card_configs_user_id ON public.card_configs(user_id);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_shipping_addresses_order_id ON public.shipping_addresses(order_id);
CREATE INDEX idx_otp_verifications_email ON public.otp_verifications(email);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Card Configs: Users can manage their own configurations
CREATE POLICY "Users can view own card configs" ON public.card_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create card configs" ON public.card_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own card configs" ON public.card_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own card configs" ON public.card_configs
    FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shipping Addresses: Users can manage their own addresses
CREATE POLICY "Users can view own addresses" ON public.shipping_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create addresses" ON public.shipping_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.shipping_addresses
    FOR UPDATE USING (auth.uid() = user_id);

-- Payments: Users can view their own payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- Card Assets: Users can manage their own assets
CREATE POLICY "Users can view own assets" ON public.card_assets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create assets" ON public.card_assets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets" ON public.card_assets
    FOR DELETE USING (auth.uid() = user_id);

-- Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_card_configs_updated_at BEFORE UPDATE ON public.card_configs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
BEGIN
    new_order_number := 'NFC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                       LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
    ('tax_rate', '{"default": 0.05, "uae": 0.05}', 'Tax rates by region'),
    ('shipping_rates', '{"domestic": 10, "international": 25}', 'Shipping rates in USD'),
    ('card_price', '{"standard": 29.99, "premium": 49.99}', 'Card prices by type'),
    ('founder_member_discount', '{"percentage": 100, "duration_months": 12}', 'Founder member benefits')
ON CONFLICT (key) DO NOTHING;