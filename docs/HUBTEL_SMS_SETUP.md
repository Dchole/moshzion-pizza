# Hubtel SMS Setup Guide

## Why Hubtel?

- **Ghana-based**: Best reliability and lowest cost for Ghana
- **Pricing**: ~GHS 0.05-0.10 per SMS (~$0.003-0.006 USD)
- **No monthly fees**: Pay-as-you-go
- **Simple API**: Easy integration with built-in OTP API
- **OTP API**: Purpose-built OTP service (more secure than manual SMS)
- **Local support**: Ghana-based team

**Cost comparison:**

- Hubtel: ~$0.003-0.006 per SMS
- Twilio: ~$0.0625 per SMS (10-20x more expensive)
- Africa's Talking: ~$0.0116 per SMS (2-4x more expensive)

**Security benefits of Hubtel OTP API:**

- OTP codes never stored in your database (attack-proof)
- Built-in rate limiting and retry logic
- Automatic expiration handling
- Professional OTP message templates

---

## Step 1: Sign Up for Hubtel

1. Go to [https://hubtel.com](https://hubtel.com)
2. Click **Sign Up** or **Get Started**
3. Choose **SMS** service
4. Complete registration with your business details
5. Verify your account (may require business documents)

---

## Step 2: Get Your Credentials

1. Log in to [Hubtel Developer Console](https://developers.hubtel.com)
2. Navigate to **My Apps** or **API Keys**
3. Create a new app/integration
4. Copy your credentials:
   - **Client ID** (Account ID)
   - **Client Secret** (API Key)

---

## Step 3: Set Up Sender ID

Your Sender ID is the name that appears as the sender of your SMS messages (e.g., "Moshzion").

### Default Option (Quick Start):

Use your business name directly:

```
HUBTEL_SENDER_ID="Moshzion"
```

### Custom Sender ID (Recommended for Production):

1. In Hubtel console, go to **Sender IDs**
2. Request a new Sender ID
3. Submit your business name (e.g., "Moshzion")
4. Wait for approval (usually 1-3 business days)
5. Once approved, use it in your environment variables

**Note**: Custom Sender IDs require verification but look more professional.

---

## Step 4: Add Funds to Your Account

1. Go to **Billing** or **Top Up** in Hubtel dashboard
2. Add funds via:
   - Mobile Money (MTN, Vodafone, AirtelTigo)
   - Bank transfer
   - Credit/debit card
3. Start with a small amount to test (e.g., GHS 20-50)

**Tip**: GHS 50 = ~1,000 SMS messages!

---

## Step 5: Configure Environment Variables

### Local Development (.env.local)

```env
# Not needed - uses console logging in development
# OTP codes are logged to console for easy testing
```

### Production (Vercel)

Add these environment variables in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add the following (no SENDER_ID needed for OTP API):

```env
HUBTEL_CLIENT_ID=your-client-id-here
HUBTEL_CLIENT_SECRET=your-client-secret-here
```

**Note**: The OTP API automatically uses "Moshzion" as the prefix/sender in messages.

**Via Vercel CLI:**

```bash
vercel env add HUBTEL_CLIENT_ID
vercel env add HUBTEL_CLIENT_SECRET
```

---

## Step 6: Test Your Setup

### Test Locally (Console Logging)

```bash
npm run dev
# Try signing in with your phone - OTP will log to console
```

### Test in Production

```bash
# Deploy to Vercel
git push origin main

# Check Vercel logs to confirm SMS was sent
vercel logs
```

**Look for**:

```
✓ SMS sent to 0244123456 via Hubtel
```

---

## Testing Tips

1. **Start small**: Add GHS 20-50 to test
2. **Use your own number**: Test OTP flow with your phone first
3. **Check Hubtel logs**: Monitor sent messages in Hubtel dashboard
4. **Monitor costs**: Track usage in Hubtel billing section

---

## Phone Number Format

The code automatically handles Ghana phone formats:

**Accepted formats:**

- `0244123456` → Converted to `233244123456`
- `244123456` → Converted to `233244123456`
- `233244123456` → Used as-is

All automatically formatted to international format for Hubtel.

---

## Troubleshooting

### Error: "Hubtel credentials not configured"

**Solution**: Add `HUBTEL_CLIENT_ID` and `HUBTEL_CLIENT_SECRET` to Vercel environment variables, then redeploy.

### Error: "Invalid credentials"

**Solution**:

1. Verify credentials in Hubtel dashboard
2. Check for typos in environment variables
3. Ensure no extra spaces in credentials

### Error: "Insufficient balance"

**Solution**: Add funds to your Hubtel account via their dashboard.

### SMS not received

**Solution**:

1. Check Hubtel dashboard → Sent Messages to verify it was sent
2. Verify phone number is correct
3. Check recipient's phone is on and has signal
4. Some networks have delays - wait 1-2 minutes

### Error: "Invalid sender ID"

**Solution**:

1. Use default "Moshzion" or your business name
2. If using custom ID, ensure it's approved in Hubtel dashboard
3. Sender IDs must be alphanumeric, max 11 characters

---

## Cost Management Tips

1. **Monitor usage**: Check Hubtel dashboard regularly
2. **Set up alerts**: Ask Hubtel to notify you at certain balance thresholds
3. **Estimate costs**:
   - 100 users/day = 100 OTPs = GHS 5-10/day (~$0.30-0.60)
   - 1000 users/day = 1000 OTPs = GHS 50-100/day (~$3-6)
4. **OTP validity**: Current 10-minute validity reduces waste from expired codes

---

## Alternative Providers (If Needed)

If Hubtel doesn't work for you:

### Africa's Talking

- **Pricing**: ~$0.0116 per SMS to Ghana
- **Setup**: https://africastalking.com
- **Best for**: Pan-African coverage

### Twilio

- **Pricing**: ~$0.0625 per SMS to Ghana
- **Setup**: https://twilio.com
- **Best for**: Global coverage, more features

**Note**: Both are significantly more expensive than Hubtel for Ghana SMS.

---

## Production Checklist

- [ ] Hubtel account created and verified
- [ ] Client ID and Client Secret obtained
- [ ] Sender ID approved (or using default)
- [ ] Funds added to account
- [ ] Environment variables set in Vercel
- [ ] Tested OTP flow in production
- [ ] Monitoring set up for usage/costs

---

## Support

**Hubtel Support:**

- Email: support@hubtel.com
- Phone: +233 30 281 0100
- Dashboard: https://developers.hubtel.com

**Your Implementation:**

- Code: `/lib/sms.ts`
- Usage: `/lib/auth-actions.ts` (sendOTP, sendPhoneUpdateOTP)
