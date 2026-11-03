# Changelog

**English** · [简体中文](./CHANGELOG.md)

## 0.13.0 — 2026-11-03

This release improves the icon system, form validation feedback, and common component interactions, while refining navigation, examples, and appearance throughout the demo site.

### Added

- **Icon library and animation**: Added 240 line icons, bringing the total to 309 across 12 business categories. Supports `spin`, `pulse`, `bounce`, `shake`, and `draw` effects with hover, click, or continuous triggers.
- **AvatarGroup**: Added overlapping avatars, overflow counts, and a complete member panel. Avatars rise in sequence as the pointer moves across the group and return smoothly on exit. `member-click(item, index, event)` returns the business item, its index in the complete list, and the native event. Bind business data with `:item="member"` on each avatar.
- **ColorPicker underline mode**: Added `underline`, supporting an explicit local setting, inheritance from Form, and an explicit `false` override to retain a full border.

### Improved

- **Form validation feedback**: Refined label-adjacent, inline, floating, and summary feedback. Errors appear beside top labels or alongside controls in horizontal layouts, moving above controls in narrow containers. Floating messages stay outside document flow to prevent hover-induced layout jumps, while preserving accessible error associations and keyboard navigation.
- **Carousel / Splitter / Segmented motion**: Added directional, looping, and rapid-navigation transitions to Carousel. Splitter now uses a thin divider with a separate toggle handle and animated collapse/restore. Segmented animates the active indicator's position and dimensions.
- **Image preview**: Added hover and press feedback to close, navigation, zoom, and rotation controls, plus directional image transitions. The previous image remains visible until the next image loads. Improved loading failures, rapid navigation, and focus restoration.
- **Avatars and member panels**: Refined standalone avatars, image fallbacks, and semantic states. Groups expose 40% of the preceding avatar; hovered avatars become fully visible without skipping intermediate members. The overflow panel includes every member, keeps its title and count fixed, scrolls only the list, and prevents scroll chaining.
- **Descriptions**: Refined label/content hierarchy, borders, and spacing, including alternate layouts and long content on narrow screens.
- **InfiniteScroll**: Added global `size` inheritance and five density levels, with demo corners following the global radius. Added a concise paginated business-list example covering multiple fields, appended pages, completion checks, and request cancellation.

### Fixed

- **Icons and feedback examples**: Corrected geometry and proportions for messages, login/logout, filter lists, fingerprints, barcodes, USB, charging batteries, missed calls, and other icons. Completed custom Loading icon examples and aligned SVG strokes and sizing.
- **ColorPicker / ColorPickerPanel**: Removed the popup's double border while retaining the standalone panel border. Hue controls show the complete rainbow on first render, with thumbs positioned for the current color. Alpha controls display a checkerboard and a transparent-to-color gradient.
- **Tour spotlight**: Corrected target-wrapper measurements in the demo so the spotlight surrounds the entire button and remains aligned across steps, size changes, and scrolling.
- **Backtop local positioning**: Added `position="absolute"` for positioning inside a relative container, while keeping viewport-level `fixed` as the default. Corrected both local-scroll examples so each button stays with its own list.
- **Collapse**: Corrected the disclosure icon's shape, direction, and size.

### Documentation and examples

- **Component navigation**: Redesigned group hierarchy, icons, and selected states. Groups start expanded; pinned headings meet the header and fade into the scrolling menu with a frosted surface.
- **Icon gallery**: Grouped icons by business category. Search, animation, and trigger controls remain accessible while scrolling. Clicking an icon offers name and component-code copying.
- **Demos and release history**: Added interactive underline, member-click, and paginated-list examples. Release notes now include version summaries, categorized layouts, and version navigation, with light/dark and mobile support.

For earlier releases, see the [Chinese release history](./CHANGELOG.md).
