


-- 1. Clear Goods Received Notes
TRUNCATE TABLE public.goods_received_notes CASCADE;

-- 2. Clear Purchase Orders
TRUNCATE TABLE public.purchase_orders CASCADE;

-- 3. Clear Projects
TRUNCATE TABLE public.projects CASCADE;

-- 4. Clear Invoices (if any previous test entries exist)
TRUNCATE TABLE public.invoices CASCADE;

-- 5. Clear Expenses (if any previous test entries exist)
TRUNCATE TABLE public.expenses CASCADE;

-- 6. Clear Recommendations (if any previous test entries exist)
TRUNCATE TABLE public.recommendations CASCADE;

-- 7. Clear Vendors (if any previous test entries exist)
TRUNCATE TABLE public.vendors CASCADE;

-- Verify all tables are clean and empty (should all return 0)
SELECT 'projects' AS table_name, COUNT(*) AS total_rows FROM public.projects
UNION ALL
SELECT 'purchase_orders', COUNT(*) FROM public.purchase_orders
UNION ALL
SELECT 'goods_received_notes', COUNT(*) FROM public.goods_received_notes
UNION ALL
SELECT 'invoices', COUNT(*) FROM public.invoices
UNION ALL
SELECT 'expenses', COUNT(*) FROM public.expenses
UNION ALL
SELECT 'recommendations', COUNT(*) FROM public.recommendations
UNION ALL
SELECT 'vendors', COUNT(*) FROM public.vendors;
