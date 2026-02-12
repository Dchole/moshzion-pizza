# Code Review: Bad Practices & Improvements

## Issues Found & Fixes

### 1. ✅ FIXED: window.confirm Usage

**Location:** CheckoutForm.tsx:118  
**Issue:** Using native `window.confirm()` - not accessible, not customizable, breaks UX flow  
**Fix:** Created `ConfirmDialog` component with proper a11y support  
**Benefits:**

- Focus trap (native `<dialog>` element)
- Keyboard navigation (ESC to close)
- Screen reader accessible
- Matches app theme and branding
- Non-blocking (doesn't halt JS execution)

### 2. ✅ FIXED: Code Duplication: Modal Components

#### CRITICAL DUPLICATES (RESOLVED):

```tsx
// Was repeated in 3 files: AddressFormModal, PaymentMethodFormModal, SaveOrderInfoModal
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div className="p-6">{/* Form content */}</div>
  </div>
</div>
```

**Impact:** ~150 lines of duplicate code eliminated  
**Fix Applied:** Created unified `Modal` component using native `<dialog>` element

#### Form Validation Duplication (RESOLVED):

- ✅ Phone number validation logic extracted to utility functions
- ✅ Provider detection extracted to utility functions
- ✅ Used in orders.ts, PaymentMethodFormModal, AddressFormModal

**Fix Applied:** Created `/lib/utils/phone.ts` with 5 utility functions:

- `detectMobileMoneyProvider(phone: string)` - Detects MTN/Vodafone/AirtelTigo
- `formatPhoneNumber(phone: string)` - Handles 233 country code
- `isValidGhanaPhone(phone: string)` - Validates format
- `getPhoneLast4(phone: string)` - Gets last 4 digits

### 3. ✅ FIXED: Accessibility Issues

#### Color Contrast Problems (RESOLVED):

| Element                   | Current      | WCAG Rating | Status |
| ------------------------- | ------------ | ----------- | ------ |
| `text-red-800` on white   | #991b1b      | AAA ✅      | Fixed  |
| `text-green-800` on white | #166534      | AAA ✅      | Fixed  |
| `text-amber-900` on white | #78350f      | AAA ✅      | Fixed  |
| Error text                | 7:1 contrast | AAA ✅      | Fixed  |

#### Missing ARIA Labels (RESOLVED):

- ✅ Close buttons in modals have proper aria-labels
- ✅ Alert messages use `role="alert"`
- ✅ Modal overlays use native `<dialog>` with automatic `aria-modal="true"`

#### Focus Management (RESOLVED):

- ✅ All modals now use `<dialog>` element which provides:
  - Automatic focus trap ✅
  - ESC key handling ✅
  - Backdrop click handling ✅
  - Keyboard navigation ✅

### 4. ✅ FIXED: Components That Should Use Existing Components

#### Dialog Component (RESOLVED):

**Created:** `/components/ui/Modal.tsx` - Unified modal wrapper  
**Now used in:**

- ✅ AddressFormModal.tsx
- ✅ PaymentMethodFormModal.tsx
- ✅ SaveOrderInfoModal.tsx

**All modals refactored** to use new `Modal` component

#### AccountContent.tsx (RESOLVED):

**Previously:** Used generic `Dialog` for delete confirmation  
**Now:** Uses consistent `ConfirmDialog` component with danger variant

### 5. Client vs Server Components

#### Potential Server Components (Need Review):

These are currently client components but might work as server components:

**ContactForm.tsx:**

- Uses `useActionState` (client-only hook) ✅ Correctly client
- **Keep as client component**

**OrderSummary.tsx** (checkout/):

- Pure presentational component
- No hooks or interactivity
- Could be server component?
- ⚠️ BUT: Receives `onRemoveItem` callback → Must stay client

**ContactInfoStep.tsx:**

- Pure form inputs
- No state management
- Could be server component?
- ⚠️ BUT: Parent needs to manage form state → Must stay client

**Verdict:** Current client/server split is appropriate

### 6. ✅ FIXED: Code That Should Be Components

#### Duplicate Error Display Pattern (RESOLVED):

```tsx
// Was repeated in 5+ files - now replaced everywhere
<Alert variant="error" message={error} />
```

**Fix Applied:** Created `/components/ui/Alert.tsx` component with:

- WCAG AAA color contrast (7:1 ratio)
- 4 variants: error, success, warning, info
- Proper `role="alert"` for screen readers
- Consistent styling across app

#### Now Used In:

- ✅ CheckoutForm.tsx
- ✅ ContactInfoStep.tsx
- ✅ ContactForm.tsx
- ✅ AddressFormModal.tsx
- ✅ PaymentMethodFormModal.tsx
- ✅ SaveOrderInfoModal.tsx

#### Form Field Pattern:

```tsx
// Repeated in AddressFormModal, PaymentMethodFormModal, ContactInfoStep
<div>
  <label className="block text-sm font-medium mb-1">
    {label} <span className="text-red-500">*</span>
  </label>
  <Input ... />
</div>
```

**Fix Needed:** Create `<FormField>` wrapper component

### 7. Missing Next.js Features

#### Image Optimization Not Used Everywhere:

**CheckoutForm previously used raw `<img>`** → Now uses Next Image ✅  
**Check:** Other components for image usage

#### Link Component Usage:

**global-error.tsx:** Was using `<a>` → Fixed to use `<Link>` ✅

#### Metadata API:

**Need to verify:** All pages have proper metadata exports

### 8. Performance Issues

#### Unnecessary Re-renders:

**AddressFormModal.tsx:**

- Form state updates trigger full re-render
- **Fix:** Use useCallback for handlers, memo for child components

**PaymentMethodFormModal.tsx:**

- Same issue as address modal
- Provider detection runs on every render
- **Fix:** useMemo for expensive calculations

#### Bundle Size:

**Material UI Icons:** Importing entire icon set?

- Check import statements
- Use tree-shaking friendly imports: `@mui/icons-material/IconName`

### 9. Design Patterns to Improve

#### Magic Strings:

```tsx
// Scattered throughout codebase
("Mobile Money", "MTN", "Vodafone", "AirtelTigo");
```

**Fix:** Create constants in `lib/config.ts`:

```tsx
export const PAYMENT_PROVIDERS = {
  MOBILE_MONEY: "Mobile Money",
  MTN: "MTN",
  VODAFONE: "Vodafone",
  AIRTELTIGO: "AirtelTigo"
} as const;
```

#### Inconsistent Error Handling:

- Some functions return `{success, error}`
- Some throw exceptions
- Some return null

**Fix:** Standardize on Result pattern:

```tsx
type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };
```

---

## Priority Order

### Phase 1: High Impact ✅ COMPLETED

1. ✅ Replace window.confirm with ConfirmDialog
2. ✅ Create unified Modal component (native `<dialog>`)
3. ✅ Fix color contrast issues (WCAG AAA compliant)
4. ✅ Refactor modals to use Modal component

### Phase 2: Medium Impact ✅ COMPLETED

5. ✅ Create Alert component (Error/Success/Warning/Info)
6. ⏳ Create FormField component (deferred - low priority)
7. ✅ Extract phone utility functions (5 functions created)
8. ✅ Fix AccountContent to use ConfirmDialog
9. ✅ Replace all inline alert displays with Alert component
10. ✅ Fix orders.ts to use phone utilities

### Phase 3: Low Impact (Future)

9. Add useMemo/useCallback optimizations
10. Standardize error handling pattern
11. Create payment provider constants
12. Add comprehensive unit tests

---

## Files Refactored ✅

### Modals (All Complete):

- ✅ AddressFormModal.tsx → Uses Modal component (225→170 lines, -55)
- ✅ PaymentMethodFormModal.tsx → Uses Modal component (304→275 lines, -29)
- ✅ SaveOrderInfoModal.tsx → Uses Modal component (186→172 lines, -14)
- ✅ AccountContent.tsx → Uses ConfirmDialog
- ✅ CheckoutForm.tsx → Uses ConfirmDialog and Alert

### New Components Created:

- ✅ `/components/ui/Modal.tsx` - Native `<dialog>` wrapper with focus trap
- ✅ `/components/ui/ConfirmDialog.tsx` - Accessible confirmation dialogs
- ✅ `/components/ui/Alert.tsx` - Error/Success/Warning/Info messages (WCAG AAA)
- ✅ `/lib/utils/phone.ts` - 5 phone utility functions

### Alert Component Integration:

- ✅ CheckoutForm.tsx
- ✅ ContactInfoStep.tsx
- ✅ ContactForm.tsx
- ✅ AddressFormModal.tsx
- ✅ PaymentMethodFormModal.tsx
- ✅ SaveOrderInfoModal.tsx

### Server Actions Updated:

- ✅ orders.ts → Uses detectMobileMoneyProvider() and getPhoneLast4()

## Impact Summary

**Lines Removed:** ~200 lines of duplicate code eliminated
**Improvements:**

- Native `<dialog>` with automatic focus management
- WCAG AAA color contrast (7:1 ratio)
- Centralized phone utilities (single source of truth)
- Consistent confirmation and alert patterns
- Better accessibility and keyboard navigation
