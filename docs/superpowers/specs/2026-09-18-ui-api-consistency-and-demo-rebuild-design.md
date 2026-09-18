# Zt UI API Consistency, Overlay Behavior, and Demo Rebuild Design

## Context

Zt UI is a new component library. It does not preserve deprecated aliases or duplicate public APIs for historical callers. The library should expose one standard way to express each behavior, while still allowing different concepts—such as visual theme status and validation status—to use different vocabularies when their meanings differ.

This change extends the recently added Form underline appearance, fixes SelectBox popup overflow, improves Button and Tooltip presentation, audits all components for visual and API consistency, and rebuilds the component documentation pages around a shared page and status-control architecture.

## Goals

- Let every underline-capable control opt in or out independently while still inheriting Form defaults.
- Remove genuine deprecated or duplicate compatibility APIs and all public compatibility guidance.
- Ensure SelectBox never creates nested panel/page scrollbars near viewport edges.
- Give small-radius Buttons a suitably flat appearance and scale visual depth with radius.
- Make Tooltip content-sized by default and support explicit width and height.
- Establish and enforce consistent UI and API contracts across the whole library.
- Rebuild every component documentation page with a shared structure and contextual status controller.

## Non-goals

- Do not merge visual-theme `danger` and validation `error` into one universal status vocabulary.
- Do not add `status` to components that do not naturally support a six-color visual theme.
- Do not rewrite components that already satisfy the audited contracts.
- Do not add migration warnings, hidden aliases, compatibility shims, or deprecated forwarding props.
- Do not push, deploy Pages, or publish npm as part of implementation.

## 1. Underline Appearance API

The following public components add `underline?: boolean`:

- Input
- Password
- InputNumber
- InputTag
- InputOtp
- Select
- SelectBox
- Autocomplete
- Cascader
- TreeSelect
- DatePicker
- DateTimePicker
- TimePicker
- TimeSelect
- Mention

Resolution is tri-state:

1. An explicit component `underline` value wins.
2. `underline="true"` forces the underline surface outside an underline Form.
3. `underline="false"` restores the ordinary outlined surface inside an underline Form.
4. An omitted value inherits the nearest Form appearance.

Every public control owns its appearance boundary. Nested implementation controls and teleported popup controls do not independently inherit the outer Form appearance. Nested Forms reset the inherited boundary and can establish their own value. The resolver remains internal; only component props and `ZtForm underline` are public.

Controls for which underline is inappropriate remain unchanged: Button, Upload, Rate, Switch, Slider, Segmented, Radio, Checkbox, Transfer, ColorPicker, and display/layout controls.

## 2. Compatibility API Removal

Remove duplicate legacy interfaces completely:

- `ZtRadioGroupProps.variant`; `segmented` is the only segmented-style switch.
- `ZtPaginationProps.small`; `size` is the only density API.
- `ZtBadgeProps.type`; `status` is the only badge semantic color API.

Delete their runtime branches, types, metadata, examples, generated API entries, and compatibility prose. Repository audits reject `@deprecated`, legacy recommendations, and descriptions that direct new users from one public alias to another.

Status vocabularies are not part of this removal. Visual theme statuses and validation statuses express different concepts and may retain `danger` and `error` respectively. Existing DatePicker and InputOtp status behavior is not renamed by this project.

Mentions of historical uploaded files or browser history describe data or browser behavior, not API compatibility, and remain when accurate. A locally chosen import name such as `ZtFullscreenLoading` is not a compatibility alias and may remain when it prevents a naming collision in an example.

## 3. SelectBox Popup Geometry and Scrolling

SelectBox continues to use the shared anchored-dropdown geometry:

- Measure available space above and below the trigger.
- Use the requested/default bottom direction when it fits.
- Flip above when the lower side cannot fit and the upper side has more room.
- Constrain the chosen panel to the available viewport height and the standard viewport gutter.
- Recompute on resize, scroll, content changes, pagination changes, and remote-result changes.

The popup root becomes a non-scrolling column layout. Search, selection summary, pagination, paste result, and confirm/cancel actions remain fixed within the panel. The options region is the sole vertical scroll owner. The panel must not create a second scrollbar, and opening it must not add page-level overflow.

When neither side can fit the desired panel height, the panel uses the larger side, stays inside the viewport, and reduces only the options-region height. Remote loading, empty, error, batch-paste, and selected-only modes follow the same geometry.

## 4. Button Radius-Dependent Depth

Button depth derives from the resolved radius token and requires no new prop:

- Radius below `5px`: flat treatment. Remove gradients and outer depth shadows; use solid fills, borders, and color changes for hover/active feedback.
- Radius from `5px` through `8px`: very light depth. Use no obvious gradient, at most a subtle inner highlight and low-opacity one-pixel shadow.
- Radius above `8px`: pronounced depth. A restrained gradient and clearer shadow/pressed transition are allowed.

The thresholds apply to every size and six-color visual status. Disabled and loading states reduce emphasis consistently. Focus-visible remains clearly distinguishable and reduced-motion disables movement without removing state feedback.

## 5. Tooltip Sizing

`ZtTooltipProps` adds:

```ts
width?: number | string
height?: number | string
```

Numbers become pixels. Strings are used as CSS lengths. With neither prop, the tooltip uses content width (`max-content`) with a viewport-safe maximum width; short text stays compact and long text wraps. Explicit width fixes the outer width. Explicit height fixes the outer height, and overflow scrolls only within the content region.

Popover receives the corresponding low-level height capability and owns conversion, positioning, arrow coordinates, flipping, and viewport constraints. Tooltip forwards its values directly rather than translating compatibility props. Position is recalculated after size or content changes.

## 6. Whole-Library UI and API Contract Audit

Create a component contract matrix covering every public component. Each row records either compliance or a concrete fix. Audit these dimensions:

### Density and geometry

- Interactive density uses `mini | small | default | medium | large` unless geometry is intrinsically numeric or CSS-sized, such as Icon and QRCode.
- Numeric width and height props become pixels; string values remain CSS lengths.
- Control heights, internal spacing, icon scale, and adjoining controls align at every density.

### Radius and depth

- Components derive radius from ConfigProvider unless an explicit documented component API overrides it.
- Input, surface, card, and overlay families use coherent radius ratios.
- Shadow and elevation match interaction and radius rather than being applied uniformly.

### Status and validation

- Six-color visual-theme families share tokens and defaults within their family.
- Validation families retain validation semantics, including `error` where it represents field validity.
- Form validation state wins over decorative status when both affect the same validation surface.

### Interaction and accessibility

- Hover, active, focus-visible, disabled, readonly, loading, and reduced-motion behavior follow common rules.
- Keyboard models, roles, accessible names, state announcements, and focus restoration are verified by component family.

### Overlays

- Popups share viewport gutters, flipping, layering, Teleport, focus restoration, and nested-overlay ownership.
- Fixed chrome never becomes an accidental scroll container; the designated content region owns overflow.

### API language

- Common props use consistent names and value conversion: `size`, `status`, `disabled`, `clearable`, `width`, `height`, and `placement`.
- Component-specific semantics remain explicit rather than being renamed only for surface uniformity.
- Public types and generated metadata are the source of truth, with audits preventing documentation drift.

Existing compliant components are recorded as such and are not rewritten. Each violation requires a focused source change, a contract regression, and visual verification.

## 7. Documentation Site Architecture

Every component page moves to a shared `ComponentPageShell` structure:

1. Component title and purpose
2. Key usage guidance
3. Interactive examples
4. Design and accessibility notes
5. Generated API reference
6. Related scenarios

Catalog metadata declares page identity, component family, status-controller capability, supported visual statuses, default status, and examples. The shell eliminates repeated page scaffolding while retaining component-specific explanations.

### Contextual status controller

Add an internal `DemoStatusProvider` for pages whose main component supports the six visual-theme statuses.

- Button and Tag are excluded and retain full status matrices.
- Workflow/domain statuses such as Steps and Result do not use this controller.
- Desktop uses the approved right-side floating panel.
- The panel shows a three-column, two-row grid. Every choice has a color block and its status value below it.
- The selected choice uses background, outline, and a check mark so state is not color-only.
- Mobile collapses to a lower-right pill containing the current color and text, for example `状态 · primary`; activating it opens a bottom panel with the same grid.
- The selected status persists across page navigation. Pages that support a narrower set use their declared default without aliases.

The provider updates every applicable live example on the page. Per-example status switches and repeated status matrices are removed. Site-only provider plumbing is stripped from displayed source. The code panel emits a standalone, copyable example with an ordinary component `status` binding and no dependency on documentation internals.

## 8. Testing and Verification

Implementation follows test-driven development.

### Underline

- Cover all 15 controls for explicit true, explicit false, Form inheritance, nested Form boundaries, disabled/validation states, and popup isolation.
- Use production CSS computed-style tests for geometry, hover, focus, and semantic lines.

### Removed APIs

- Type tests and runtime tests prove removed props are absent and no longer affect behavior.
- Metadata generation and repository audits reject deprecated or compatibility guidance.

### SelectBox

- Browser geometry covers sufficient space, flip above, constrained space on both sides, narrow viewport, resize, scroll, pagination, remote loading, paste mode, and selected-only mode.
- Assert the page and popup root do not scroll while the options region is the sole vertical scroll owner.

### Button and Tooltip

- Button computed styles cover radii `0`, `3`, `4`, `8`, `9`, and `16px`, all sizes and statuses, and interactive/disabled states.
- Tooltip covers short content, wrapping, numeric and string dimensions, explicit height overflow, flips, arrow alignment, and dynamic size changes.

### Library audit and site

- Produce a checked-in audit matrix for all public components.
- Compile and mount every documentation example.
- Verify displayed-source parity and absence of site-only dependencies.
- Test status synchronization, page persistence, excluded pages, keyboard operation, and mobile bottom-panel behavior.
- Run desktop/mobile browser visual matrices in light/dark themes, all densities, representative radii, and semantic states; capture console and page errors.

Final verification runs the library test suite, typecheck, ESM/UMD builds, site test suite, site typecheck/build, generated-file drift checks, and an independent whole-branch review.

## 9. Delivery

Implementation is committed locally on the repository's working branch according to the existing project workflow. GitHub push, Pages deployment, and npm publication require a later explicit release request.
