# Supabase Email Configuration Guide

## Issue: Email Confirmation Not Working on Vercel Production

### Problem Description
- Email confirmation works on `localhost` but not on Vercel production
- User registration succeeds (data saved to database)
- Confirmation email is not delivered to Gmail (not in inbox or spam)

---

## Supabase Dashboard Settings to Verify

### 1. Authentication Settings

**Navigate to**: Supabase Dashboard → Authentication → Settings

#### A. Email Confirmation Settings
- ✅ **Enable email confirmations**: Should be `ON`
- ✅ **Email confirmation expiry**: Default 24 hours (86400 seconds)
- ✅ **Confirm email change**: Should be `ON` if you want to verify email changes

#### B. Redirect URLs
**CRITICAL**: Add your production domain to allowed redirect URLs

```
Site URL: https://task-new-app.vercel.app
```

**Additional redirect URLs (comma separated)**:
```
http://localhost:3010/auth/confirm,
http://localhost:3000/auth/confirm,
https://task-new-app.vercel.app/auth/confirm
```

### 2. Email Templates

**Navigate to**: Supabase Dashboard → Authentication → Templates

#### A. Confirm Signup Template
- **Subject**: `Confirm your signup`
- **Body**: Should contain `{{ .ConfirmationURL }}`
- **Redirect URL**: `https://task-new-app.vercel.app/auth/confirm`

#### B. Check Template Placeholders
Ensure the email template contains:
```html
<a href="{{ .ConfirmationURL }}">Confirm your account</a>
```

### 3. Email Provider Configuration

**Navigate to**: Supabase Dashboard → Settings → Project Settings

#### A. SMTP Settings (If Using Custom SMTP)
- **Enable custom SMTP**: Check if this is enabled
- **SMTP credentials**: Verify they are correct
- **From email**: Should be a verified domain

#### B. Built-in Email Service
- **Provider**: Supabase (default)
- **Rate limits**: Check if you've exceeded limits
- **Domain reputation**: Ensure your domain isn't blacklisted

### 4. API Rate Limits

**Navigate to**: Supabase Dashboard → Settings → API

#### A. Rate Limiting
- **Auth requests per hour**: Default 30,000
- **Email sending**: Check if there are specific limits
- **Anonymous requests**: Verify limits aren't exceeded

---

## Code Implementation Fixes Applied

### 1. Dynamic Redirect URL Configuration
```typescript
// Before (hardcoded):
emailRedirectTo: 'https://task-new-app.vercel.app/auth/confirm'

// After (dynamic):
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3010' 
    : 'https://task-new-app.vercel.app';
};

emailRedirectTo: `${getBaseUrl()}/auth/confirm`
```

### 2. Enhanced Logging for Debugging
```typescript
logger.log('🔗 Registration attempt:', {
  email: email.trim().toLowerCase(),
  redirectUrl: emailRedirectUrl,
  environment: process.env.NODE_ENV,
  baseUrl
});
```

### 3. User-Friendly Success Messages
- Added bilingual success messages when email confirmation is required
- Clear instructions for users to check their email

---

## Testing Steps

### 1. Test Email API Endpoint
```bash
curl -X POST https://task-new-app.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

### 2. Manual Registration Test
1. Go to: https://task-new-app.vercel.app/register
2. Fill out the registration form
3. Check console logs in browser dev tools
4. Verify user appears in Supabase Auth dashboard
5. Check email inbox (including spam folder)

### 3. Verification Steps
- [ ] User data saved to `auth.users` table
- [ ] User data saved to `public.users` table  
- [ ] Console logs show correct redirect URL
- [ ] Email appears in Gmail (check spam folder)
- [ ] Email confirmation link works

---

## Common Issues & Solutions

### Issue 1: Emails Going to Spam
**Solution**: 
- Use custom SMTP with verified domain
- Add SPF/DKIM records to your domain
- Use Supabase's built-in email service (recommended)

### Issue 2: Redirect URL Mismatch
**Solution**: 
- Ensure all redirect URLs are added to Supabase dashboard
- Use dynamic URL generation in code (implemented)

### Issue 3: Rate Limiting
**Solution**: 
- Check Supabase dashboard for rate limit warnings
- Wait for rate limits to reset
- Consider upgrading Supabase plan if needed

### Issue 4: Email Template Issues
**Solution**: 
- Verify email templates contain proper placeholders
- Test templates in Supabase dashboard
- Check for HTML formatting errors

---

## Environment Variables Verification

Ensure these are set correctly in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://jiavfbatdnytctkikrbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

**Check in terminal:**
```bash
vercel env ls
```

---

## Debug Checklist

- [ ] Supabase Auth settings configured correctly
- [ ] Production URL added to redirect URLs
- [ ] Email templates contain proper placeholders
- [ ] Environment variables set on Vercel
- [ ] Rate limits not exceeded
- [ ] Custom SMTP configured (if applicable)
- [ ] Email not in spam folder
- [ ] User data successfully saved to database
- [ ] Console logs show correct configuration

---

## Next Steps After Configuration

1. **Deploy Updated Code**: Push changes to trigger Vercel deployment
2. **Test Registration Flow**: Complete end-to-end test
3. **Monitor Logs**: Check both browser console and Vercel function logs
4. **Verify Email Delivery**: Test with multiple email providers (Gmail, Outlook, etc.)

---

*Generated on: September 2, 2025*  
*Status: Configuration guide and code fixes completed*