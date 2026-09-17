# Independent feedback subsystem review

Reviewed Alert, Loading, Message, Notification, MessageBox, Tooltip and Dropdown implementations and existing feedback-expansion tests against approved lifecycle, keyboard, theme and Promise contracts.

Confirmed defects (all fixed with failing regression tests before fixes):

1. Tooltip initialized visible even when disabled (`tooltip/ZtTooltip.vue`). Initial state now respects disabled.
2. Tooltip pointerleave closed a still keyboard-focused trigger (`tooltip/ZtTooltip.vue`). Trigger hover, popup hover and focus now remain independent visibility reasons; Escape clears them.
3. Dropdown left its open menu actionable after disabled changed (`dropdown/ZtDropdown.vue`). Disabled closes the menu and command handler guards component disabled.
4. Dropdown Escape emitted visible-change(false) twice through Popover and menu handlers (`dropdown/ZtDropdown.vue`). Transition notifications are deduplicated.
5. Grouped contextual messages under the same ConfigProvider shared a handle between different component owners (`message/runtime.ts`, `message/service.ts`). One owner's unmount could remove another owner's message. Grouping now includes the originating component uid as ownership scope; global grouping remains unchanged.
6. A grouped message update restarted its timer while hovered (`message/service.ts`). Restart preserves independent hover/focus pause reasons. Mouseleave does not resume while focus remains.
7. Generic service wrapper return cast failed the site's newer TypeScript checker (`message/runtime.ts`). Explicit unknown bridge retains the public generic callable contract.

Additional verified contracts: contextual messages keep dark theme and inherited size; MessageBox failed async submission remains visible for retry, resolves confirmation value on success and restores original focus. Existing tests continue verifying cancellation versus confirmation, prompt validation, safe text, expiry, notification close and owner cleanup. No remaining high-priority defect found in this bounded review; browser verification remains coordinator-owned.

Verification: `npm test -- tests/feedback-review.spec.ts tests/feedback-expansion.spec.ts` → 18 tests passed (9 new regression/review + 9 existing). `npm run typecheck` passed. New test file is tests/feedback-review.spec.ts. No shared registration files changed.
