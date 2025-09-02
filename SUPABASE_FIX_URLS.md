# 🔧 Supabase Dashboard URL Fix Required

## Problem:
Email confirmation links are using old domain: `task-new-app.vercel.app`
But the actual app is deployed at: `task-manager-rho-black.vercel.app`

## Fix Required in Supabase Dashboard:

### 1. Go to Supabase Dashboard:
- URL: https://supabase.com/dashboard
- Project: jiavfbatdnytctkikrbw

### 2. Authentication → Settings → URL Configuration:

#### Current (Incorrect):
- Site URL: `https://task-new-app.vercel.app`
- Redirect URLs: `https://task-new-app.vercel.app/auth/confirm`

#### Should be (Correct):
- Site URL: `https://task-manager-rho-black.vercel.app`
- Redirect URLs:
  - `https://task-manager-rho-black.vercel.app/auth/confirm` (email confirmation)
  - `https://task-manager-rho-black.vercel.app/reset-password` (password reset)
  - `http://localhost:3000/auth/confirm` (development - email confirmation)
  - `http://localhost:3000/reset-password` (development - password reset)

### 3. Save Changes

## After Fix:
- New email confirmations will use correct domain
- Existing tokens will still work with manual URL replacement

## Temporary Workaround:
Replace `task-new-app` with `task-manager-rho-black` in confirmation URLs manually.