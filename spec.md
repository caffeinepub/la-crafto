# LA Crafto

## Current State
Full e-commerce store with Himalayan/Buddhist-inspired design. Has products, cart, orders, contact messages, and Stripe payments. Admin panel at `/admin` requires Internet Identity login + a `CAFFEINE_ADMIN_TOKEN` environment variable to be entered manually, which is causing "Invalid token" errors for the owner.

## Requested Changes (Diff)

### Add
- Auto-admin initialization: when a logged-in (non-anonymous) user visits `/admin` and no admin has been assigned yet, that user is automatically granted admin role without needing any token input.

### Modify
- Backend `_initializeAccessControlWithSecret` function: ignore the provided token entirely. The first non-anonymous principal that calls this function becomes admin; all subsequent callers become regular users.
- Admin page frontend: remove the token input form. Instead, on login, automatically call `_initializeAccessControlWithSecret("")` so the first user to log in becomes admin seamlessly.

### Remove
- Token input panel (`AdminTokenPanel` component) -- no longer needed.
- Dependency on `CAFFEINE_ADMIN_TOKEN` environment variable for admin access.

## Implementation Plan
1. Regenerate Motoko backend with auto-admin logic: `_initializeAccessControlWithSecret` ignores the token argument; first non-anonymous caller becomes admin automatically.
2. Update `AdminPage.tsx`: after login, automatically call `_initializeAccessControlWithSecret("")`, then refetch `isAdmin`. Remove `AdminTokenPanel` component entirely.
