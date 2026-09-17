# Zt UI Site Rebuild Design

## Goal

Rebuild the documentation site around a complete component-system plan while preserving the current header and its global size, radius, theme, search, and primary navigation controls.

## Information architecture

The site has four reading layers:

1. **Foundations** — theme, density, radius, status colors, accessibility, responsive behavior.
2. **Components** — eight capability groups with stable and planned components shown together.
3. **Patterns** — business tasks that compose multiple stable components.
4. **API** — generated props, events, slots, methods, and exported types.

The component plan uses eight durable groups: Foundations, Layout, Form, Data Display, Navigation, Feedback, Overlay, and Media. Stable components link to demos. Planned components appear only in the component landscape and roadmap, with a priority phase and a short scope statement.

## Experience

- Keep the existing header markup and controls.
- Replace the long undifferentiated page body with a clear workspace: grouped sidebar, editorial content canvas, optional page outline.
- The home page shows system metrics, the eight capability areas, primary reading paths, and the next roadmap priorities.
- The component index supports text search, group filters, and stable/planned filters.
- Component demo pages retain runnable examples, code copy, API links, related scenarios, and responsive behavior.
- Mobile keeps the fixed header and uses an off-canvas sidebar; content and demos remain one column.

## Component roadmap

- **Now / P0:** Layout, Row, Col, Space, Divider, Alert, Message, Tooltip, Dropdown, Empty, Skeleton.
- **Next / P1:** Cascader, TreeSelect, TimePicker, ColorPicker, Rate, Transfer, Table, Tree, Timeline, Calendar, Statistic.
- **Later / P2:** Anchor, Affix, Backtop, Carousel, Tour, Watermark, QRCode.

The roadmap is planning metadata, not public component exports. It must never create dead demo or API routes.

## Visual direction

Use a restrained editorial system: warm neutral surfaces, ink-blue typography, cobalt interaction color, compact monospace metadata, clear rules, and quiet status chips. Avoid oversized gradients and generic dashboard cards. Preserve the header’s existing visual identity and let the body use larger whitespace and stronger typographic hierarchy.

## Verification

- Catalog tests cover all stable routes, unique names, eight groups, valid roadmap phases, and no planned API routes.
- Search covers stable components, planned components, foundations, and scenarios.
- Existing demo/API coverage remains green.
- Site typecheck/build passes in normal and GitHub Pages base modes.
- Inspect desktop, tablet, mobile, light, dark, and at least two global sizes.
