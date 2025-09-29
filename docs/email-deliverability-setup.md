# Email Deliverability Setup Guide

This guide helps you configure SPF, DKIM, and DMARC records for optimal email deliverability with Resend.

## Prerequisites

1. A custom domain (e.g., `linkist.ai`)
2. Access to your domain's DNS settings
3. A Resend account with API key

## Step 1: SPF (Sender Policy Framework)

SPF records specify which mail servers are authorized to send emails for your domain.

### DNS Configuration

Add this TXT record to your domain's DNS:

**Record Type:** TXT
**Name/Host:** `@` (or your root domain)
**Value:** `v=spf1 include:_spf.resend.com ~all`

### What it means:
- `v=spf1` - SPF version 1
- `include:_spf.resend.com` - Allow Resend's servers to send emails
- `~all` - Soft fail for other servers (recommended for testing)

For production, you may want to use `-all` (hard fail) for stricter policy.

## Step 2: DKIM (DomainKeys Identified Mail)

DKIM adds a digital signature to your emails to verify authenticity.

### Resend Configuration

1. Go to your [Resend Dashboard](https://resend.com/domains)
2. Add your custom domain
3. Resend will provide DKIM records to add to your DNS

### DNS Configuration

Resend will give you records like:

**Record Type:** TXT
**Name/Host:** `resend._domainkey.yourdomain.com`
**Value:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...` (long key provided by Resend)

## Step 3: DMARC (Domain-based Message Authentication)

DMARC builds on SPF and DKIM to provide policy instructions for email handling.

### DNS Configuration

Add this TXT record:

**Record Type:** TXT
**Name/Host:** `_dmarc.yourdomain.com`
**Value:** `v=DMARC1; p=quarantine; ruf=mailto:dmarc@yourdomain.com; rua=mailto:dmarc@yourdomain.com; fo=1`

### DMARC Policy Options:
- `p=none` - Monitor only (recommended for testing)
- `p=quarantine` - Send suspicious emails to spam folder
- `p=reject` - Reject suspicious emails entirely

### DMARC Tags Explained:
- `v=DMARC1` - DMARC version 1
- `p=quarantine` - Policy for failed authentication
- `ruf=` - Address for forensic reports
- `rua=` - Address for aggregate reports
- `fo=1` - Generate forensic reports for any failure

## Step 4: Verification

### Check DNS Propagation
Use these tools to verify your records:
- [MXToolbox](https://mxtoolbox.com/)
- [DMARC Analyzer](https://www.dmarcanalyzer.com/dmarc-checker/)
- [Mail-Tester](https://www.mail-tester.com/)

### Test Email Sending
```bash
# Using curl to test your API
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "test@yourdomain.com",
    "to": ["test@gmail.com"],
    "subject": "DMARC Test",
    "html": "<strong>This is a test email</strong>"
  }'
```

## Step 5: Environment Configuration

Update your `.env` file:

```env
RESEND_API_KEY=re_your_actual_api_key
EMAIL_FROM=Linkist <noreply@yourdomain.com>
```

## Step 6: Monitoring

### Set up DMARC Monitoring
1. Create an email address for DMARC reports (e.g., `dmarc@yourdomain.com`)
2. Monitor daily/weekly reports for:
   - Authentication failures
   - Unauthorized sending attempts
   - Delivery statistics

### Common Issues and Solutions

**SPF Record Issues:**
- Error: "Too many DNS lookups"
- Solution: Minimize `include:` statements, use IP addresses when possible

**DKIM Issues:**
- Error: "DKIM signature verification failed"
- Solution: Verify DNS record is correctly copied from Resend

**DMARC Issues:**
- Error: "DMARC policy not found"
- Solution: Ensure `_dmarc` subdomain record exists

## Security Best Practices

1. **Start with lenient policies** (`p=none`) and gradually tighten
2. **Monitor reports regularly** for unauthorized sending attempts
3. **Use different subdomains** for different email types:
   - `noreply@yourdomain.com` - Transactional emails
   - `marketing@yourdomain.com` - Marketing emails
   - `support@yourdomain.com` - Support emails

4. **Implement email authentication** in your application code
5. **Regular audits** of email sending practices

## Expected Results

After proper configuration:
- **Inbox delivery rate:** 95%+ to major providers
- **Spam score:** Significantly reduced
- **Brand protection:** Domain spoofing prevention
- **Compliance:** GDPR/CAN-SPAM compliant email practices

## Troubleshooting

### Email going to spam?
1. Check SPF/DKIM/DMARC alignment
2. Warm up your sending domain gradually
3. Maintain good sender reputation
4. Use proper email headers and content

### DNS propagation slow?
- DNS changes can take 24-48 hours to fully propagate
- Use different DNS checkers to verify
- Contact your DNS provider if issues persist

---

For more information:
- [Resend Documentation](https://resend.com/docs)
- [DMARC.org](https://dmarc.org/)
- [RFC 7489 - DMARC](https://tools.ietf.org/html/rfc7489)