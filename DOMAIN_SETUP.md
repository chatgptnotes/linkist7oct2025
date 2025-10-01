# Custom Domain Setup for linkist.2men.co

## Current Status
✅ Domain added to Vercel project
✅ DNS CNAME record created in Vercel DNS
⏳ **Waiting for GoDaddy nameserver update**

## Issue
The parent domain `2men.co` is registered with GoDaddy but its nameservers are still pointing to GoDaddy instead of Vercel.

**Current Nameservers (GoDaddy):**
- ns57.domaincontrol.com
- ns58.domaincontrol.com

**Required Nameservers (Vercel):**
- ns1.vercel-dns.com
- ns2.vercel-dns.com

## Solution: Update Nameservers at GoDaddy

### Step 1: Login to GoDaddy
1. Go to https://www.godaddy.com/
2. Sign in to your account
3. Navigate to **My Products** → **All Products and Services**

### Step 2: Manage Domain
1. Find `2men.co` in your domain list
2. Click the **DNS** button next to the domain

### Step 3: Change Nameservers
1. Scroll down to the **Nameservers** section
2. Click **Change**
3. Select **Enter my own nameservers (advanced)**
4. Replace existing nameservers with:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
5. Click **Save**

### Step 4: Wait for DNS Propagation
- **Typical time**: 5-30 minutes
- **Maximum time**: 48 hours
- **Check progress**: Use https://dnschecker.org/ to monitor `linkist.2men.co`

## Alternative: Quick Setup with A Record (No Nameserver Change)

If you don't want to change nameservers for the entire domain:

### At GoDaddy DNS Management:
1. Go to DNS settings for `2men.co`
2. Add new record:
   - **Type**: A
   - **Name**: linkist
   - **Value**: 76.76.21.21
   - **TTL**: 600 (10 minutes)
3. Save the record
4. Wait 5-15 minutes for propagation

This method is faster but you'll need to manage DNS at GoDaddy instead of Vercel.

## Verify Setup

Once nameservers are updated, verify with:

```bash
# Check nameservers
nslookup -type=NS 2men.co

# Check subdomain resolution
nslookup linkist.2men.co

# Check if site is accessible
curl -I https://linkist.2men.co
```

## After DNS Propagation

Once DNS is working, the domain will:
- ✅ Automatically get SSL certificate from Let's Encrypt
- ✅ Redirect HTTP to HTTPS
- ✅ Point to latest production deployment
- ✅ Work without Chrome security warnings

## Current Project URLs

While waiting for DNS:
- **Local Development**: http://localhost:3000
- **Latest Vercel Deployment**: https://linkist29sep2025-rhzizmqhh-chatgptnotes-6366s-projects.vercel.app
- **Custom Domain (pending)**: https://linkist.2men.co

## Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN" Error
This means the domain doesn't exist in DNS yet. Wait for propagation after updating nameservers.

### "ERR_CERT_COMMON_NAME_INVALID" Error
Vercel hasn't issued SSL certificate yet. Wait a few minutes after DNS propagation.

### Domain Still Not Working After 48 Hours
1. Verify nameservers at GoDaddy match: ns1.vercel-dns.com, ns2.vercel-dns.com
2. Clear your browser DNS cache: chrome://net-internals/#dns
3. Try from different network or device
4. Contact Vercel support if issue persists

## Support

- **GoDaddy Support**: https://www.godaddy.com/help
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/domains
- **DNS Checker**: https://dnschecker.org/
