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

### 2. Code Duplication: Modal Components

#### CRITICAL DUPLICATES:

```tsx
// Repeated in 3 files: AddressFormModal, PaymentMethodFormModal, SaveOrderInfoModal
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div className="p-6">{/* Form content */}</div>
  </div>
</div>
```

**Impact:** ~150 lines of duplicate code  
**Fix Needed:** Use unified `Modal` component (created)

#### Form Validation Duplication:

- Phone number validation logic repeated in PaymentMethodFormModal (lines 75-84) and ContactInfoStep
- Provider detection repeated in orders.ts (lines 95-107) and PaymentMethodFormModal (lines 76-84)

**Fix Needed:** Extract to utility functions in `/lib/utils/phone.ts`:

- `detectMobileMoneyProvider(phone: string)`
- `formatPhoneNumber(phone: string)`

### 3. Accessibility Issues

#### Color Contrast Problems:

| Element                       | Current           | WCAG Rating | Fix Needed                   |
| ----------------------------- | ----------------- | ----------- | ---------------------------- |
| `text-red-500` on white       | #ef4444           | AA ❌       | Use `text-red-700` (#b91c1c) |
| `text-red-700` on `bg-red-50` | #b91c1c / #fef2f2 | AAA ✅      | Keep                         |
| Error text                    | Current 4.5:1     | AA Pass     | Consider AAA (7:1)           |

#### Missing ARIA Labels:

- Close buttons in modals (fixed in new Modal component)
- Form sections need `aria-describedby` for error messages
- Modal overlays need `aria-modal="true"` (native `<dialog>` provides this)

#### Focus Management:

- Modals using `fixed` divs don't trap focus ❌
- New `Modal` component uses `<dialog>` which provides:
  - Automatic focus trap ✅
  - ESC key handling ✅
  - Backdrop click handling ✅

### 4. Components That Should Use Existing Components

#### Dialog Component Exists But Not Used:

**File:** `/components/ui/Dialog.tsx` (uses native `<dialog>`)  
**Not used in:**

- AddressFormModal.tsx
- PaymentMethodFormModal.tsx
- SaveOrderInfoModal.tsx

**Fix:** Refactor all modals to use new `Modal` component

#### AccountContent.tsx Already Uses Dialog:

**Line 556:** Uses `Dialog` for delete confirmation  
**Should:** Use consistent `ConfirmDialog` component

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

### 6. Code That Should Be Components

#### Duplicate Error Display Pattern:

```tsx
// Repeated in 5+ files
{
  error && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800 text-sm">{error}</p>
    </div>
  );
}
```

**Fix Needed:** Create`<ErrorAlert>` component:

```tsx
<ErrorAlert message={error} />
```

#### Duplicate Success Display Pattern:

```tsx
// Repeated in 3+ files
{
  success && (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <p className="text-green-800 text-sm">{message}</p>
    </div>
  );
}
```

**Fix Needed:** Create `<Alert>` component with variants

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

### Phase 1: High Impact (Do Now) ✅

1. ✅ Replace window.confirm with ConfirmDialog
2. ✅ Create unified Modal component
3. ⏳ Fix color contrast issues
4. ⏳ Refactor modals to use Modal component

### Phase 2: Medium Impact (This Session)

5. Create Alert component (Error/Success messages)
6. Create FormField component
7. Extract phone utility functions
8. Fix AccountContent to use ConfirmDialog

### Phase 3: Low Impact (Future)

9. Add useMemo/useCallback optimizations
10. Standardize error handling pattern
11. Create payment provider constants
12. Add comprehensive unit tests

---

## Files to Refactor

### Immediate:

- [ ] AddressFormModal.tsx → Use Modal component
- [ ] PaymentMethodFormModal.tsx → Use Modal component
- [ ] SaveOrderInfoModal.tsx → Use Modal component
- [ ] AccountContent.tsx → Use ConfirmDialog

### Create New Components:

- [ ] `/components/ui/Alert.tsx` (Error/Success/Warning/Info)
- [ ] `/components/ui/FormField.tsx` (Label + Input wrapper)
- [ ] `/lib/utils/phone.ts` (Phone utilities)
