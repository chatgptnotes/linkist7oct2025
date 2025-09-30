#!/bin/bash

# Add environment variables to Vercel
echo "Adding environment variables to Vercel..."

# Add NEXT_PUBLIC_SUPABASE_URL
echo "https://nyjduzifuibyowibhsjg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Add SUPABASE_SERVICE_ROLE_KEY
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55amR1emlmdWlieW93aWJoc2pnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0MTY0MywiZXhwIjoyMDcyNTE3NjQzfQ.1K6Ny2ZtNhXf_gQItroghc_-7j4xdxncCAGZqWHHNE0" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Add STRIPE_SECRET_KEY (placeholder - you'll need to get this from Stripe)
echo "sk_test_your_stripe_secret_key_here" | vercel env add STRIPE_SECRET_KEY production

# Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (placeholder - you'll need to get this from Stripe)
echo "pk_test_your_stripe_publishable_key_here" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# Add STRIPE_WEBHOOK_SECRET (placeholder - you'll need to get this from Stripe)
echo "whsec_your_stripe_webhook_secret_here" | vercel env add STRIPE_WEBHOOK_SECRET production

echo "Environment variables added successfully!"
