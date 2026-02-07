# Passwordless OTP Authentication

## Overview

The authentication system has been refactored to use **passwordless OTP (One-Time Password) verification** instead of traditional password-based authentication. This provides better security and UX.

## How It Works

### User Flow

1. **Enter Phone Number** → User inputs their phone (e.g., `0234567890`)
2. **Receive OTP** → System sends 6-digit code via SMS
3. **Enter Code** → User inputs the verification code
4. **Signed In** → Account created (if new) or logged in (if existing)

### Key Features

- ✅ No passwords to remember or manage
- ✅ Automatic account creation on first login
- ✅ 6-digit OTP codes with 10-minute expiry
- ✅ Rate limiting (5 attempts per OTP)
- ✅ 60-second cooldown between OTP resends
- ✅ Phone verification on every login

## Database Schema Changes

### Removed Fields

- `password` - No longer needed

### Added Fields

- `otpCode` - Current OTP (6 digits)
- `otpExpiresAt` - When the OTP expires (10 minutes)
- `otpAttempts` - Failed verification attempts counter

## Implementation Details

### Server Actions (`lib/auth-actions.ts`)

**`sendOTP(phone)`**

- Validates phone format
- Generates 6-digit random code
- Creates/updates user record with OTP
- Sends SMS via `sendOTPVerification()`
- Sets 10-minute expiry

**`verifyOTP(phone, code)`**

- Validates phone + code format
- Checks OTP exists and not expired
- Enforces rate limiting (max 5 attempts)
- Verifies code matches
- Marks phone as verified
- Signs user in via NextAuth

### UI Component (`components/AuthForm.tsx`)

**Two-Step Form:**

1. **Phone Step** - Collect phone number, send OTP
2. **OTP Step** - Enter 6-digit code, verify

**Features:**

- Countdown timer for resend (60 seconds)
- "Change phone" button to go back
- Auto-format OTP input (digits only, max 6)
- Success message for new accounts
- Social login (Google/Facebook) still available

### Auth Configuration (`auth.ts`)

**Credentials Provider:**

- Only requires `phone` (no password)
- OTP verification happens before calling `signIn()`
- This just confirms user exists in DB

## SMS Integration

The `sendOTPVerification()` function in `lib/sms.ts`:

- **Development:** Logs OTP to console (free)
- **Production:** Uses AWS SNS to send SMS

## Security Features

1. **Time-Limited:** OTPs expire after 10 minutes
2. **Rate Limiting:** Max 5 verification attempts
3. **Resend Cooldown:** 60 seconds between requests
4. **Single-Use:** OTP cleared after successful verification
5. **Phone Binding:** Code only valid for the phone it was sent to

## Running the Migration

To apply these database changes:

```bash
# 1. Regenerate Prisma client
npm run db:generate
# or: npx prisma generate

# 2. Create and apply migration
npm run db:migrate -- --name remove_password_add_otp
# or: npx prisma migrate dev --name remove_password_add_otp

# 3. Restart dev server
npm run dev
```

**Note:** If you encounter zsh autocorrect issues with `@types/pg`, use:

```bash
setopt nocorrect && npm run db:generate
setopt nocorrect && npm run db:migrate -- --name remove_password_add_otp
```

## Testing

1. Navigate to `/account`
2. Enter phone: `0234567890`
3. Click "Continue"
4. Check console for OTP code (dev mode)
5. Enter the 6-digit code
6. Should be signed in!

Try again with same phone - will log you in as existing user.

## Benefits Over Password Auth

| Aspect                 | Password                           | OTP                      |
| ---------------------- | ---------------------------------- | ------------------------ |
| **UX**                 | Remember password, reset flow      | Just enter phone         |
| **Security**           | Can be phished, reused             | Time-limited, single-use |
| **Friction**           | Create password, confirm, remember | Receive code, enter      |
| **Phone Verification** | Separate step                      | Built into login         |
| **Account Recovery**   | Password reset emails              | Just request new OTP     |

## Next Steps

- [ ] Set up AWS SNS for production SMS sending
- [ ] Add phone verification badge/indicator in UI
- [ ] Implement session timeout/refresh logic
- [ ] Add option to "remember this device" (reduce OTP frequency)
- [ ] Analytics for OTP delivery success rates
