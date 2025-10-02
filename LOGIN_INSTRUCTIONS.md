# How to Fix Login Issue

## Problem
The user `cmd@hopehospital.com` exists in **Supabase Auth** but not in the **custom users table** that the login system checks.

## Solution

### Step 1: Run SQL to Add User to Custom Table

1. **Open Supabase Dashboard**:
   - Go to https://supabase.com/dashboard
   - Select your project: `nyjduzifuibyowibhsjg`

2. **Open SQL Editor**:
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste this SQL**:

```sql
-- Add cmd@hopehospital.com with password: test123456
INSERT INTO users (
  email,
  first_name,
  last_name,
  phone_number,
  password_hash,
  role,
  email_verified,
  mobile_verified
)
VALUES (
  'cmd@hopehospital.com',
  'CMD',
  'User',
  '+919373111709',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'user',
  true,
  false
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  phone_number = EXCLUDED.phone_number;
```

4. **Click "Run"** (or press Cmd/Ctrl + Enter)

### Step 2: Login

After running the SQL, you can login with:

**Email**: `cmd@hopehospital.com`
**Password**: `test123456`

---

## Alternative: Use Existing Test Accounts

These accounts are already in the database:

### Admin Account
- **Email**: `admin@linkist.com`
- **Password**: `admin123456`
- **Role**: Admin

### Test Account
- **Email**: `test@linkist.com`
- **Password**: `user123456`
- **Role**: User

---

## Or Use Passwordless Login

Skip traditional login entirely and use the email OTP system:

1. Go to: http://localhost:3000/verify-email
2. Enter: `cmd@hopehospital.com`
3. Check the terminal for the 6-digit OTP code
4. Enter the code
5. ✅ Verified and logged in!

---

## Why This Happened

The system has two authentication mechanisms:

1. **Supabase Auth** (OAuth, magic links) - where you registered
2. **Custom Users Table** (email + password) - what the login checks

The registration created the user in Supabase Auth but didn't sync to the custom users table. The SQL above adds it to the custom table so traditional login works.

---

## File Location

The SQL file is saved at:
`/Users/murali/Downloads/linkistnfc-main 5/add-test-user.sql`

You can also run it using the Supabase CLI:
```bash
supabase db execute --file add-test-user.sql
```
