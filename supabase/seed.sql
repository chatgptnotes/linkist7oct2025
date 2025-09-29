-- =====================================================
-- SEED DATA FOR ADMIN DASHBOARD
-- Run this after the migration to populate initial data
-- =====================================================

-- Create default admin user (password should be hashed in production)
INSERT INTO admin_users (
    email,
    username,
    password_hash,
    first_name,
    last_name,
    role,
    is_super_admin,
    permissions
) VALUES
(
    'admin@linkist.com',
    'admin',
    '$2b$10$K7L1OJ0TfGBpDkQTXDNWjOeYKdGxBPb/dXYrKbPLAYaUe88AxKqOi', -- password: Admin@123
    'Super',
    'Admin',
    'super_admin',
    true,
    '["all"]'::jsonb
),
(
    'manager@linkist.com',
    'manager',
    '$2b$10$K7L1OJ0TfGBpDkQTXDNWjOeYKdGxBPb/dXYrKbPLAYaUe88AxKqOi', -- password: Admin@123
    'John',
    'Manager',
    'manager',
    false,
    '["users.read", "users.write", "orders.read", "orders.write", "products.read"]'::jsonb
),
(
    'support@linkist.com',
    'support',
    '$2b$10$K7L1OJ0TfGBpDkQTXDNWjOeYKdGxBPb/dXYrKbPLAYaUe88AxKqOi', -- password: Admin@123
    'Sarah',
    'Support',
    'support',
    false,
    '["tickets.read", "tickets.write", "users.read"]'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Insert system settings
INSERT INTO system_settings (key, value, category, description) VALUES
('site_name', '"Linkist NFC Admin Dashboard"', 'general', 'Site name for admin dashboard'),
('maintenance_mode', 'false', 'general', 'Enable/disable maintenance mode'),
('order_prefix', '"ORD"', 'orders', 'Prefix for order numbers'),
('order_auto_confirm_minutes', '30', 'orders', 'Auto-confirm orders after X minutes'),
('low_stock_threshold', '10', 'inventory', 'Alert when stock falls below this level'),
('email_from_name', '"Linkist NFC"', 'email', 'Default sender name for emails'),
('email_from_address', '"noreply@linkist.com"', 'email', 'Default sender email address'),
('email_footer_text', '"© 2025 Linkist NFC. All rights reserved."', 'email', 'Email footer text'),
('sms_enabled', 'true', 'sms', 'Enable SMS notifications'),
('sms_provider', '"fast2sms"', 'sms', 'SMS provider (twilio/fast2sms)'),
('currency', '"USD"', 'payment', 'Default currency'),
('tax_rate', '5', 'payment', 'Default tax rate percentage'),
('shipping_fee', '10', 'payment', 'Default shipping fee'),
('free_shipping_threshold', '100', 'payment', 'Free shipping for orders above this amount'),
('google_analytics_id', '""', 'analytics', 'Google Analytics tracking ID'),
('facebook_pixel_id', '""', 'analytics', 'Facebook Pixel ID'),
('support_email', '"support@linkist.com"', 'support', 'Support email address'),
('support_phone', '"+971501234567"', 'support', 'Support phone number'),
('business_hours', '"Mon-Fri 9AM-6PM GST"', 'support', 'Business hours'),
('backup_enabled', 'true', 'system', 'Enable automatic backups'),
('backup_retention_days', '30', 'system', 'Keep backups for X days'),
('api_rate_limit', '100', 'api', 'API calls per minute limit'),
('session_timeout_minutes', '60', 'security', 'Admin session timeout'),
('max_login_attempts', '5', 'security', 'Max failed login attempts before lockout'),
('lockout_duration_minutes', '15', 'security', 'Account lockout duration')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- Insert product categories
INSERT INTO product_categories (name, slug, description, display_order) VALUES
('NFC Cards', 'nfc-cards', 'Smart NFC business cards', 1),
('Digital Profiles', 'digital-profiles', 'Virtual business card profiles', 2),
('Accessories', 'accessories', 'Card holders and accessories', 3),
('Premium', 'premium', 'Premium and custom designs', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (sku, name, slug, description, category_id, price, stock_quantity, is_active, is_featured) VALUES
(
    'NFC-STD-001',
    'Standard NFC Business Card',
    'standard-nfc-card',
    'Professional NFC business card with custom design',
    (SELECT id FROM product_categories WHERE slug = 'nfc-cards'),
    49.99,
    100,
    true,
    true
),
(
    'NFC-PRE-001',
    'Premium Metal NFC Card',
    'premium-metal-nfc-card',
    'Luxury metal NFC card with gold finish',
    (SELECT id FROM product_categories WHERE slug = 'premium'),
    99.99,
    50,
    true,
    true
),
(
    'DIG-PRO-001',
    'Digital Profile Only',
    'digital-profile-only',
    'Virtual business card with QR code',
    (SELECT id FROM product_categories WHERE slug = 'digital-profiles'),
    24.99,
    999,
    true,
    false
),
(
    'ACC-HLD-001',
    'Premium Card Holder',
    'premium-card-holder',
    'Leather card holder for NFC cards',
    (SELECT id FROM product_categories WHERE slug = 'accessories'),
    19.99,
    200,
    true,
    false
)
ON CONFLICT (sku) DO NOTHING;

-- Insert sample users
INSERT INTO users (email, first_name, last_name, phone_number, email_verified, mobile_verified) VALUES
('john.doe@example.com', 'John', 'Doe', '+971501234567', true, true),
('jane.smith@example.com', 'Jane', 'Smith', '+971502345678', true, false),
('mike.wilson@example.com', 'Mike', 'Wilson', '+971503456789', true, true),
('sarah.jones@example.com', 'Sarah', 'Jones', '+971504567890', false, false),
('david.brown@example.com', 'David', 'Brown', '+971505678901', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert user profiles for sample users
INSERT INTO user_profiles (user_id, company_name, job_title, is_vip, total_orders, total_spent)
SELECT
    u.id,
    CASE
        WHEN u.email = 'john.doe@example.com' THEN 'Tech Corp'
        WHEN u.email = 'jane.smith@example.com' THEN 'Design Studio'
        WHEN u.email = 'mike.wilson@example.com' THEN 'Marketing Agency'
        WHEN u.email = 'sarah.jones@example.com' THEN 'Consulting Firm'
        ELSE 'Freelancer'
    END as company_name,
    CASE
        WHEN u.email = 'john.doe@example.com' THEN 'CEO'
        WHEN u.email = 'jane.smith@example.com' THEN 'Creative Director'
        WHEN u.email = 'mike.wilson@example.com' THEN 'Marketing Manager'
        WHEN u.email = 'sarah.jones@example.com' THEN 'Senior Consultant'
        ELSE 'Entrepreneur'
    END as job_title,
    CASE
        WHEN u.email IN ('john.doe@example.com', 'jane.smith@example.com') THEN true
        ELSE false
    END as is_vip,
    FLOOR(RANDOM() * 5) + 1 as total_orders,
    FLOOR(RANDOM() * 500) + 50 as total_spent
FROM users u
WHERE u.email IN (
    'john.doe@example.com',
    'jane.smith@example.com',
    'mike.wilson@example.com',
    'sarah.jones@example.com',
    'david.brown@example.com'
)
ON CONFLICT DO NOTHING;

-- Insert sample orders
DO $$
DECLARE
    user_emails TEXT[] := ARRAY[
        'john.doe@example.com',
        'jane.smith@example.com',
        'mike.wilson@example.com',
        'sarah.jones@example.com',
        'david.brown@example.com'
    ];
    statuses TEXT[] := ARRAY['pending', 'confirmed', 'production', 'shipped', 'delivered'];
    i INT;
    order_id UUID;
BEGIN
    FOR i IN 1..20 LOOP
        INSERT INTO orders (
            order_number,
            status,
            customer_name,
            email,
            phone_number,
            card_config,
            shipping,
            pricing,
            created_at
        ) VALUES (
            'ORD-2025' || LPAD(i::TEXT, 4, '0'),
            statuses[1 + (i % 5)],
            'Customer ' || i,
            user_emails[1 + (i % 5)],
            '+97150' || LPAD((1234567 + i)::TEXT, 7, '0'),
            jsonb_build_object(
                'design', 'template-' || (1 + (i % 3)),
                'color', CASE (i % 3) WHEN 0 THEN 'black' WHEN 1 THEN 'white' ELSE 'gold' END,
                'material', CASE (i % 2) WHEN 0 THEN 'plastic' ELSE 'metal' END
            ),
            jsonb_build_object(
                'address', i || ' Business Bay',
                'city', 'Dubai',
                'country', 'UAE',
                'postal_code', '00000'
            ),
            jsonb_build_object(
                'subtotal', 49.99 + (i * 10),
                'tax', 2.50 + (i * 0.5),
                'shipping', CASE WHEN i % 3 = 0 THEN 0 ELSE 10 END,
                'total', 62.49 + (i * 10.5)
            ),
            NOW() - INTERVAL '1 day' * (20 - i)
        ) RETURNING id INTO order_id;

        -- Add order items
        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_amount
        ) VALUES (
            order_id,
            (SELECT id FROM products ORDER BY RANDOM() LIMIT 1),
            'NFC Business Card',
            'NFC-' || LPAD(i::TEXT, 3, '0'),
            1 + (i % 3),
            49.99,
            49.99 * (1 + (i % 3))
        );

        -- Add order status history
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES (order_id, statuses[1 + (i % 5)], 'Initial status');
    END LOOP;
END $$;

-- Insert sample support tickets
INSERT INTO support_tickets (
    ticket_number,
    user_id,
    customer_email,
    customer_name,
    subject,
    description,
    category,
    priority,
    status
)
SELECT
    'TKT-2025' || LPAD(row_number() OVER ()::TEXT, 4, '0'),
    u.id,
    u.email,
    u.first_name || ' ' || u.last_name,
    CASE (row_number() OVER () % 5)
        WHEN 0 THEN 'Order not received'
        WHEN 1 THEN 'Card not working'
        WHEN 2 THEN 'Need design change'
        WHEN 3 THEN 'Billing question'
        ELSE 'General inquiry'
    END,
    'Customer needs assistance with their order or product.',
    CASE (row_number() OVER () % 3)
        WHEN 0 THEN 'order'
        WHEN 1 THEN 'technical'
        ELSE 'general'
    END,
    CASE (row_number() OVER () % 4)
        WHEN 0 THEN 'urgent'
        WHEN 1 THEN 'high'
        WHEN 2 THEN 'medium'
        ELSE 'low'
    END,
    CASE (row_number() OVER () % 3)
        WHEN 0 THEN 'open'
        WHEN 1 THEN 'in_progress'
        ELSE 'resolved'
    END
FROM users u
LIMIT 10;

-- Insert email templates
INSERT INTO email_templates (name, subject, html_content, category, is_active) VALUES
(
    'Order Confirmation',
    'Your Linkist NFC Order #{{order_number}} is Confirmed',
    '<h1>Thank you for your order!</h1><p>Your order #{{order_number}} has been confirmed.</p>',
    'order',
    true
),
(
    'Shipping Notification',
    'Your Linkist NFC Order #{{order_number}} has Shipped',
    '<h1>Your order is on its way!</h1><p>Track your package: {{tracking_url}}</p>',
    'order',
    true
),
(
    'Welcome Email',
    'Welcome to Linkist NFC!',
    '<h1>Welcome {{first_name}}!</h1><p>Get started with your digital business card.</p>',
    'user',
    true
)
ON CONFLICT DO NOTHING;

-- Create sample analytics events
INSERT INTO analytics_events (
    event_type,
    event_category,
    event_action,
    event_label,
    event_value,
    user_id,
    page_url,
    device_type,
    created_at
)
SELECT
    CASE (i % 4)
        WHEN 0 THEN 'page_view'
        WHEN 1 THEN 'button_click'
        WHEN 2 THEN 'form_submit'
        ELSE 'purchase'
    END,
    CASE (i % 3)
        WHEN 0 THEN 'product'
        WHEN 1 THEN 'checkout'
        ELSE 'account'
    END,
    'user_action',
    'test_event_' || i,
    RANDOM() * 100,
    (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
    '/page-' || i,
    CASE (i % 2) WHEN 0 THEN 'mobile' ELSE 'desktop' END,
    NOW() - INTERVAL '1 hour' * i
FROM generate_series(1, 50) i;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW revenue_reports;

-- Update dashboard metrics cache
INSERT INTO dashboard_metrics (metric_type, period, value)
VALUES
(
    'dashboard',
    'today',
    jsonb_build_object(
        'total_orders', (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        'total_revenue', (SELECT COALESCE(SUM((pricing->>'total')::DECIMAL), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        'new_users', (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE),
        'active_tickets', (SELECT COUNT(*) FROM support_tickets WHERE status IN ('open', 'in_progress'))
    )
),
(
    'dashboard',
    'week',
    jsonb_build_object(
        'total_orders', (SELECT COUNT(*) FROM orders WHERE created_at >= DATE_TRUNC('week', NOW())),
        'total_revenue', (SELECT COALESCE(SUM((pricing->>'total')::DECIMAL), 0) FROM orders WHERE created_at >= DATE_TRUNC('week', NOW())),
        'new_users', (SELECT COUNT(*) FROM users WHERE created_at >= DATE_TRUNC('week', NOW())),
        'active_tickets', (SELECT COUNT(*) FROM support_tickets WHERE status IN ('open', 'in_progress'))
    )
)
ON CONFLICT (metric_type, period) DO UPDATE
SET value = EXCLUDED.value,
    calculated_at = NOW();

-- Grant necessary permissions (adjust based on your Supabase setup)
-- These might need to be run separately depending on your permissions

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Default admin credentials:';
    RAISE NOTICE '  Email: admin@linkist.com';
    RAISE NOTICE '  Password: Admin@123';
    RAISE NOTICE '';
    RAISE NOTICE 'Other test accounts:';
    RAISE NOTICE '  manager@linkist.com / Admin@123';
    RAISE NOTICE '  support@linkist.com / Admin@123';
END $$;