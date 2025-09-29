# Admin Dashboard Database Setup - Complete Supabase Integration

## Overview

This document provides comprehensive instructions for setting up the admin dashboard with complete Supabase database integration. **ALL admin data is stored in Supabase**, ensuring centralized data management, real-time updates, and secure access control.

## Database Architecture

### 🗄️ Data Storage Strategy

**100% of admin dashboard data is persisted in Supabase PostgreSQL database:**

- ✅ **Users & Profiles** - Stored in `users` and `user_profiles` tables
- ✅ **Orders & Transactions** - Stored in `orders`, `order_items`, `order_status_history` tables
- ✅ **Products & Inventory** - Stored in `products`, `product_categories`, `inventory_movements` tables
- ✅ **Admin Users & Auth** - Stored in `admin_users`, `admin_sessions` tables
- ✅ **Support Tickets** - Stored in `support_tickets`, `ticket_messages` tables
- ✅ **Email Campaigns** - Stored in `email_campaigns`, `email_campaign_recipients` tables
- ✅ **Analytics & Metrics** - Stored in `analytics_events`, `dashboard_metrics` tables
- ✅ **CMS Content** - Stored in `cms_pages`, `blog_posts` tables
- ✅ **System Settings** - Stored in `system_settings` table
- ✅ **Activity Logs** - Stored in `admin_activity_logs` table
- ✅ **File Uploads** - Stored in Supabase Storage with metadata in `file_uploads` table

## Setup Instructions

### 1. Database Migration

Run the migration script to create all required tables in Supabase:

```bash
# Navigate to the feature-admin directory
cd /Users/murali/Downloads/linkistnfc-main\ 5\ 29\ sept\ 8.25\ pm/.trees/feature-admin

# Connect to your Supabase project and run the migration
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Using SQL Editor in Supabase Dashboard
# Copy contents of supabase/migrations/001_admin_schema.sql
# Paste and run in SQL Editor
```

### 2. Seed Initial Data

Populate the database with initial data:

```sql
-- Run in Supabase SQL Editor
-- Copy contents of supabase/seed.sql
```

This creates:
- Default admin users (admin@linkist.com / Admin@123)
- System settings
- Sample products and categories
- Sample orders and users
- Test data for development

### 3. Environment Configuration

Create `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Dashboard Settings
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
ADMIN_SESSION_SECRET=your_session_secret
```

### 4. Verify Database Connection

Test the connection using the provided API:

```bash
# Test dashboard metrics API
curl http://localhost:3001/api/admin/dashboard

# Test users API
curl http://localhost:3001/api/admin/users

# Test orders API
curl http://localhost:3001/api/admin/orders
```

## Database Tables Reference

### Core Admin Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `admin_users` | Admin authentication | Roles, permissions, MFA support |
| `admin_sessions` | Session management | Token-based auth, IP tracking |
| `admin_activity_logs` | Audit trail | Complete activity logging |

### User Management Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | Customer accounts | Email/mobile verification |
| `user_profiles` | Extended user data | Company info, preferences, VIP status |

### E-commerce Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `orders` | Order management | Status tracking, shipping info |
| `order_items` | Line items | Product details, customization |
| `order_status_history` | Status changes | Complete order timeline |
| `products` | Product catalog | Inventory, pricing, variants |
| `product_categories` | Product organization | Hierarchical categories |
| `inventory_movements` | Stock tracking | Complete inventory history |

### Support & Communication

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `support_tickets` | Customer support | Priority levels, assignment |
| `ticket_messages` | Ticket conversations | Internal notes support |
| `email_campaigns` | Email marketing | Segmentation, tracking |
| `email_templates` | Reusable templates | Variables, categories |

### Analytics & Settings

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `analytics_events` | Event tracking | User behavior, conversions |
| `dashboard_metrics` | Cached metrics | Performance optimization |
| `system_settings` | Configuration | Key-value store |
| `revenue_reports` | Financial data | Materialized view for speed |

## API Endpoints

All endpoints interact directly with Supabase:

### User Management
- `GET /api/admin/users` - Fetch all users from Supabase
- `POST /api/admin/users` - Create new user in Supabase
- `PUT /api/admin/users` - Update user in Supabase
- `DELETE /api/admin/users?id={id}` - Delete user from Supabase

### Order Management
- `GET /api/admin/orders` - Fetch orders with filters
- `POST /api/admin/orders` - Create new order
- `PUT /api/admin/orders` - Update order status/details
- `DELETE /api/admin/orders?id={id}` - Cancel order

### Dashboard Metrics
- `GET /api/admin/dashboard?period={today|week|month|year}` - Get cached metrics
- `POST /api/admin/dashboard/refresh` - Force refresh metrics

### Products & Inventory
- `GET /api/admin/products` - Fetch product catalog
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products` - Update product details
- `POST /api/admin/inventory` - Record inventory movement

### Support Tickets
- `GET /api/admin/tickets` - Fetch support tickets
- `POST /api/admin/tickets` - Create new ticket
- `PUT /api/admin/tickets` - Update ticket status
- `POST /api/admin/tickets/{id}/messages` - Add ticket message

## Security Features

### Row-Level Security (RLS)

All tables have RLS policies enabled:

```sql
-- Example: Admin users can only be accessed by service role or the user themselves
CREATE POLICY "Admin full access" ON admin_users
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        (auth.jwt() ->> 'email' = email AND is_active = true)
    );
```

### Data Access Patterns

1. **Service Role** - Full access for admin operations
2. **Authenticated Users** - Limited to their own data
3. **Anonymous** - Read-only for public data

## Real-time Features

Enable real-time subscriptions for live updates:

```typescript
// Subscribe to order updates
const subscription = supabase
  .channel('orders')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('Order change:', payload);
      // Update UI in real-time
    }
  )
  .subscribe();
```

## Performance Optimizations

### Indexes
All frequently queried columns have indexes:
- Email addresses
- Order numbers
- Status fields
- Timestamps
- Foreign keys

### Materialized Views
Revenue reports use materialized views for instant loading:
```sql
REFRESH MATERIALIZED VIEW revenue_reports;
```

### Caching Strategy
Dashboard metrics are cached with 5-minute TTL:
- Reduces database load
- Improves response times
- Automatic refresh on demand

## Backup & Recovery

### Automatic Backups
Supabase provides automatic daily backups:
- Point-in-time recovery
- 30-day retention
- One-click restore

### Manual Backup
```bash
# Export all data
pg_dump -h your-db-host -U postgres -d postgres > backup.sql
```

## Monitoring & Debugging

### Activity Logs
All admin actions are logged:
```sql
SELECT * FROM admin_activity_logs
WHERE admin_user_id = 'user-uuid'
ORDER BY created_at DESC;
```

### Performance Monitoring
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC;
```

### Health Checks
```typescript
// API health check
const health = await adminDb.supabase
  .from('system_settings')
  .select('key')
  .limit(1);

if (health.error) {
  console.error('Database connection failed');
}
```

## Development Workflow

### Local Development
1. Use Supabase CLI for local instance
2. Run migrations on local database
3. Use seed data for testing

### Staging Environment
1. Create separate Supabase project
2. Apply same migrations
3. Use test data

### Production Deployment
1. Run migrations via Supabase Dashboard
2. Verify all tables created
3. Monitor initial performance

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify environment variables
   - Check Supabase service status
   - Confirm network connectivity

2. **Permission Denied**
   - Check RLS policies
   - Verify service role key
   - Confirm user permissions

3. **Slow Queries**
   - Check indexes exist
   - Analyze query plans
   - Consider pagination

4. **Data Inconsistency**
   - Check foreign key constraints
   - Verify transaction boundaries
   - Review trigger functions

## Best Practices

1. **Always use transactions** for multi-table operations
2. **Implement proper error handling** in all API routes
3. **Log all admin actions** for audit trail
4. **Use prepared statements** to prevent SQL injection
5. **Validate all input data** before database operations
6. **Implement rate limiting** on API endpoints
7. **Use connection pooling** for better performance
8. **Regular backup verification** to ensure recovery capability

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review error logs in Supabase Dashboard
3. Contact technical support with error details

---

**Remember**: ALL admin dashboard data is stored in Supabase. No local storage or external databases are used. This ensures data consistency, security, and scalability.