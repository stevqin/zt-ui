# Overlay / Portal Compatibility Implementation Plan

**Goal:** Bring the audited PortalModal/PortalDrawer capabilities into zt-ui, then retain BIP's public Portal interface with thin adapters.
**Architecture:** Keep one shared overlay lifecycle in zt-ui; extend Modal geometry/content/loading and aliases without changing existing defaults. Portal adapters translate legacy defaults, events and CSS hooks; no cross-project links.
**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, npm.
**Spec:** User-approved comparison and migration scope in this conversation.

## Global Constraints
- Preserve existing zt-ui defaults and animation; preserve BIP defaults (640px, padding 0, breakpoint 768px, focusTrap false).
- Preserve business event/slot semantics, CSS hooks, layer ordering and unsaved state.
- Keep independently installed npm dependencies; no automatic commits or pushes.

## Review Focus
- Cached routes must close/release teleported windows; retained parents must close children.
- Reopen during leave or pending close must reset busy and invalidate stale guards.
- External MessageBox and teleported selects must retain usable focus/Escape behavior.
- Fullscreen geometry must preserve author height/maxHeight and custom scroll content.
- Mixed compatibility wrappers must share the same overlay/scroll-lock stack.

## Tasks
- [x] 1. Tests then implementation: overlay KeepAlive, parent visibility, reopen races and external keyboard ownership in `src/components/overlay/useOverlay.ts`.
- [x] 2. Tests then implementation: Modal height/maxHeight/subtitle/closeLabel/loading/bodyScroll/fullscreenBelow/bottom placement; header-actions/content, show/hide and fullscreen aliases. Bring common lifecycle fixes to Drawer.
- [x] 3. Add realistic demos and catalog/API metadata; run full library/site suites and builds.
- [x] 4. Tests then implementation: PortalModal/PortalDrawer thin adapters forwarding legacy props/slots/events/methods/CSS hooks; keep legacy CSS for BIP sizing and visual hooks, remove duplicated runtime logic.
- [x] 5. Verify an independently packed zt-ui release artifact against BIP without leaving local dependency paths, then publish/upgrade via registry when authorized/authenticated; run full BIP tests/build and browser checks.
- [x] 6. Fresh review, one correction pass and final status; do not commit/push unless explicitly requested.

## Verification ledger (2026-10-21)
- Library: 155 files / 1,634 tests passed (`npm test -- --maxWorkers=2`); typecheck + ESM/UMD build passed.
- Documentation: 21 files / 691 tests passed with bounded workers; production build passed. Initial unconstrained run had three resource-contention timeouts; bounded full rerun passed without weakening assertions.
- BIP: 28 files / 238 unit tests passed; 28 Portal regression script tests passed; typecheck + production build passed against independently installed release artifact.
- Browser: real user-online Modal and role-management Drawer use zt-ui runtime with legacy classes; role header/footer remain 60px/54px and tree content retains independent scrolling. Fixed-height/loading/fullscreen and cached-page examples verified.
- Fresh compatibility review corrected absent Boolean alias precedence, footer fullscreen scope, and narrow geometry during leave; targeted regressions passed before final full suites.
- User authorized npm 0.11.0 publication and formal BIP dependency upgrade. npm publication confirmed against the official registry with matching artifact integrity; BIP manifest and canonical npm lock now pin 0.11.0 from registry.npmjs.org. Final registry-install validation passed: 238 unit tests plus typecheck and production build; installed JavaScript exactly matches the verified tarball.
- User preference: future npm authentication opens a browser for user assistance instead of requesting short-lived OTPs.
- No commits, pushes, or business form submissions performed.
