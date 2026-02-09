# Hubtel SMS Quick Reference

## 🎯 Quick Setup (5 minutes)

1. **Sign up**: https://hubtel.com
2. **Get credentials**: Dashboard → API Keys
3. **Add to Vercel**:
   ```bash
   vercel env add HUBTEL_CLIENT_ID
   vercel env add HUBTEL_CLIENT_SECRET  
   vercel env add HUBTEL_SENDER_ID
   ```
4. **Top up**: GHS 50 = ~1,000 SMS (~$3 USD)
5. **Deploy**: `git push origin main`

## 💰 Pricing

- **~$0.003-0.006 per SMS** (GHS 0.05-0.10)
- **No monthly fees**
- **Cheapest option for Ghana** (10-20x cheaper than Twilio)

## 🔑 Environment Variables

```env
HUBTEL_CLIENT_ID=your-client-id
HUBTEL_CLIENT_SECRET=your-client-secret
HUBTEL_SENDER_ID=Moshzion
```

## 📱 Phone Format (Auto-handled)

Accepts: `0244123456`, `244123456`, or `233244123456`  
Converts to: `233244123456` (international)

## 📊 Cost Examples

- 100 users/day = GHS 5-10/day (~$0.30-0.60)
- 500 users/day = GHS 25-50/day (~$1.50-3)
- 1000 users/day = GHS 50-100/day (~$3-6)

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Credentials not configured" | Add env vars in Vercel, redeploy |
| "Insufficient balance" | Top up in Hubtel dashboard |
| "Invalid sender ID" | Use "Moshzion" or request custom ID approval |
| SMS not received | Check Hubtel dashboard → Sent Messages |

## 📖 Full Guide

See [HUBTEL_SMS_SETUP.md](./HUBTEL_SMS_SETUP.md) for complete setup instructions.

## 💡 Tips

- Start with GHS 20-50 to test
- Monitor usage in Hubtel dashboard
- Check Vercel logs: `vercel logs`
- Test with your own phone first

## 🔗 Links

- Hubtel: https://hubtel.com
- Developer Console: https://developers.hubtel.com
- Support: support@hubtel.com / +233 30 281 0100
