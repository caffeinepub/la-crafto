# LA Crafto

## Current State
Full e-commerce backend with products, cart, orders, contact messages, Stripe payments, and role-based authorization. The authorization uses CAFFEINE_ADMIN_TOKEN env var to determine who becomes admin. The admin panel is inaccessible because: (1) the token isn't available to users, and (2) isCallerAdmin() traps if the user isn't registered.

## Requested Changes (Diff)

### Add
- `isCallerAdmin()` that safely returns false (never traps) when caller is unregistered

### Modify
- `_initializeAccessControlWithSecret`: Make the first non-anonymous caller become admin automatically, WITHOUT checking any token or env var
- `isAdmin()` in access-control: Return false (not trap) when user is not registered
- `hasPermission()` in access-control: Return false (not trap) when user is not registered

### Remove
- CAFFEINE_ADMIN_TOKEN env var dependency from authorization flow

## Implementation Plan
1. Update access-control.mo: isAdmin returns false for unregistered users; hasPermission returns false for unregistered users
2. Update MixinAuthorization.mo: _initializeAccessControlWithSecret makes first caller admin automatically, no env var needed
3. Update AdminPage.tsx: Remove token input form; when logged in but not admin, show a clear message explaining they need to be the first user to log in OR provide a way to re-register
