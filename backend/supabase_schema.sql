-- FINOVA Supabase Database Schema (Clean - Zero Fake/Seed Data)

-- 1. Vendors Table
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    contact_email VARCHAR(255),
    performance_score FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(100) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    budget_amount NUMERIC(12, 2) NOT NULL,
    actual_spend NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Purchase Orders (PO) Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(100) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    project_code VARCHAR(100),
    status VARCHAR(50) DEFAULT 'issued',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure project_code column exists if purchase_orders was created in a previous SQL run
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS project_code VARCHAR(100);

-- 4. Goods Received Notes (GRN) Table
CREATE TABLE IF NOT EXISTS public.goods_received_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_number VARCHAR(100) UNIQUE NOT NULL,
    po_number VARCHAR(100) REFERENCES public.purchase_orders(po_number) ON DELETE CASCADE,
    received_items_summary TEXT,
    status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100),
    vendor_name VARCHAR(255) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    storage_path TEXT,
    storage_url TEXT,
    anomalies_detected INT DEFAULT 0,
    anomalies_json JSONB,
    parsed_invoice_json JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Employee Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'queued_for_review',
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Explainable Recommendations Log Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_name VARCHAR(255) NOT NULL,
    current_price NUMERIC(12, 2) NOT NULL,
    historical_avg NUMERIC(12, 2) NOT NULL,
    price_deviation_percentage NUMERIC(6, 2),
    recommendation_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage Bucket Setup & RLS Policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', true), ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Upload Policy" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Policy" ON storage.objects;

CREATE POLICY "Public Upload Policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('invoices', 'receipts'));
CREATE POLICY "Public Read Policy" ON storage.objects FOR SELECT USING (bucket_id IN ('invoices', 'receipts'));
