# Authentication Implementation

## Architecture

This project uses **NextAuth.js v5** with a simple, cookie-based authentication architecture following Next.js 15 best practices.

### Key Principles

- **Phone-first authentication** - Phone number is the primary identifier
- **No route protection** - All users can access all pages
- **Optional authentication** - Users can complete orders without accounts
- **Cookie-based sessions** - Secure, HTTP-only cookies
- **Server Actions** - Authentication mutations use server actions
- **Type-safe** - Full TypeScript support throughout

### User Flow

1. **Unauthenticated users** can:
   - Browse the store
   - Add items to cart (stored in cookies)
   - Complete orders
   - View order tracking

2. **Authenticated users** get:
   - Saved delivery addresses
   - Saved payment information
   - Order history
   - Pre-filled checkout forms

3. **No email required** - Communication via SMS only

### Phone Number Format

Phone numbers must follow the local format:

- **10 digits** total
- Must start with **02**, **03**, or **05**
- Numbers only (no spaces or special characters in database)
- Example valid numbers: `0234567890`, `0312345678`, `0556789012`

The validation pattern: `/^(02|03|05)\d{8}$/`

## File Structure

```
auth.ts                          # NextAuth configuration
lib/
  auth.ts                        # Server-side auth utilities
  auth-actions.ts                # Server actions for authentication
app/
  api/auth/[...nextauth]/
    route.ts                     # Auth API routes
  (app)/account/
    page.tsx                     # Server component - account page
components/
  AuthForm.tsx                   # Client component - auth forms
  AccountContent.tsx             # Client component - account UI
```

## How It Works

### 1. Session Management (Cookies)

NextAuth automatically manages sessions via HTTP-only cookies. Sessions are:

- Stored as JWTs in secure cookies
- Validated on every request via middleware
- Accessible on server via `auth()` helper
- Automatically refreshed

### 2. Server Components

The account page is a server component that reads the session directly from cookies:

```typescript
// app/(app)/account/page.tsx
import { getCurrentUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await getCurrentUser(); // Reads from cookie

  if (!user) {
    return <AuthForm />;
  }

  return <AccountContent user={user} />;
}
```

### 3. Server Actions

Authentication mutations use server actions for optimal performance:

```typescript
// lib/auth-actions.ts
"use server";

export async function authenticateWithCredentials(
  phone: string,
  password: string
) {
  await signIn("credentials", { phone, password });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
```

### 4. Client Components

Client components use `useTransition` for pending states:

```typescript
// components/AuthForm.tsx
const [isPending, startTransition] = useTransition();

const handleSubmit = () => {
  startTransition(async () => {
    await authenticateWithCredentials(phone, password);
    router.push("/account");
  });
};
```

## Authentication Providers

### Configured Providers

1. **Google OAuth** (Optional)
2. **Facebook OAuth** (Optional)
3. **Phone & Password** (Primary method)

### Setup OAuth Providers

#### Google

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Authorized redirect: `http://localhost:3000/api/auth/callback/google`
4. Add to `.env.local`:

```env
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

#### Facebook

1. [Facebook Developers](https://developers.facebook.com/)
2. Create app and add Facebook Login
3. Valid OAuth redirect: `http://localhost:3000/api/auth/callback/facebook`
4. Add to `.env.local`:

```env
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
```

### SMS Verification (To Be Implemented)

Phone verification will use Twilio or similar SMS service:

- Send verification code on signup
- Verify code before account creation
- Store verified phone number

## Database Integration

### Current State

The credentials provider uses mock validation. You need to implement:

#### 1. User Database Schema

```typescript
interface User {
  id: string;
  phone: string; // unique, primary identifier (10 digits: 02/03/05 + 8 digits)
  password: string; // bcrypt hashed
  firstName: string;
  lastName: string;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Update Validation Function

In [auth.ts](auth.ts), replace the `validateUser` function:

```typescript
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function validateUser(phone: string, password: string) {
  const user = await db.user.findUnique({ where: { phone } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
}
```

#### 3. Create Sign Up API

Create `app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { phone, password, firstName, lastName } = await req.json();

  const exists = await db.user.findUnique({ where: { phone } });
  if (exists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: { phone, password: hashedPassword, firstName, lastName }
  });

  return NextResponse.json({ success: true, userId: user.id });
}
```

#### 4. Update AuthForm Sign Up Handler

In [components/AuthForm.tsx](components/AuthForm.tsx), replace the signup section:

```typescript
else {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: formData.phone,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    setErrors({ general: error });
    return;
  }

  const result = await authenticateWithCredentials(
    formData.phone,
    formData.password
  );

  if (result.success) {
    router.push("/account");
    router.refresh();
    onSuccess?.();
  }
}
```

## No Route Protection

All routes are accessible to all users. Authentication only provides:

- Saved user information
- Order history
- Pre-filled forms

Unauthenticated users can still:

- Browse products
- Add to cart (cookies)
- Complete orders
- Track orders

## Utilities

### Server-Side

```typescript
import { getCurrentUser, requireAuth } from "@/lib/auth";

// Optional auth
const user = await getCurrentUser(); // null if not authenticated

// Required auth (throws if not authenticated)
const user = await requireAuth();
```

### Client-Side (for interactive components)

```typescript
import { signOutUser } from "@/lib/auth-actions";

const handleSignOut = () => {
  startTransition(async () => {
    await signOutUser();
  });
};
```

## Environment Variables

```env
# Required
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# SMS (To be implemented)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Production Deployment

1. Generate new `AUTH_SECRET`
2. Update `NEXTAUTH_URL` to your domain
3. Update OAuth redirect URIs to production URLs
4. Ensure database connection is configured
5. Implement rate limiting on auth endpoints

## Security Features

- ✅ HTTP-only cookies (XSS protection)
- ✅ CSRF protection (built into NextAuth)
- ✅ JWT tokens (stateless sessions)
- ✅ Secure password hashing (bcrypt)
- ✅ Server-side validation
- ✅ Protected API routes

## Testing

```bash
# Start dev server
npm run dev

# Test OAuth flow
# 1. Visit http://localhost:3000/account
# 2. Click social login button
# 3. Complete OAuth flow

# Test phone/password
# 1. Visit http://localhost:3000/account
# 2. Enter phone and password
# 3. Submit form

# Test as unauthenticated user
# 1. Browse store without logging in
# 2. Add items to cart
# 3. Complete checkout flow
```

## Best Practices Followed

1. **Phone-first** - Phone number as primary identifier
2. **Server-first** - Auth checks on server, not client
3. **No forced auth** - Optional authentication
4. **Cookie-based** - Secure HTTP-only cookies
5. **Type-safe** - Full TypeScript throughout
6. **Clean code** - Proper extraction and organization
7. **Standards** - Following Next.js 15 patterns
8. **SMS-ready** - Prepared for phone verification

## Troubleshooting

### Session not persisting

- Check `AUTH_SECRET` is set
- Verify cookies are enabled
- Check `NEXTAUTH_URL` matches your domain

### OAuth fails

- Verify redirect URIs match exactly
- Check client IDs and secrets are correct
- Ensure OAuth apps are approved/published

### Type errors

- Run `npm install` to ensure types are installed
- Check [types/index.ts](types/index.ts) for type extensions

## Resources

- [NextAuth.js v5 Docs](https://authjs.dev/)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
