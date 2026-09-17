# Datetime/color report — 2026-09-17

## Delivered

- `ZtTimePicker`, `ZtTimePickerProps`, `ZtTimePickerValue`, `ZtTimePickerEndpoint`, `ZtTimePickerInstance` exported from time-picker.
- `ZtColorPicker`, `ZtColorPickerProps`, `ZtColorPickerInstance` exported from color-picker.
- `ZtColorPickerPanel`, `ZtColorPickerPanelProps`, `ZtColorPickerPanelInstance` exported from color-picker-panel.
- `ZtDatePickerPanel`, `ZtDatePickerPanelProps` exported from existing date-picker.
- All nine owned entry components now offer six actual semantic statuses and independent Status.vue examples. `ZtEntryStatus` exported from autocomplete. Form error takes priority over explicit status.

TimePicker uses existing Input/Popover and custom hour/minute/second listboxes, HH:mm or HH:mm:ss, positive column increments, disabled candidate times, range endpoint controls, ordered range validation, confirm/cancel drafts, clear to null, arrow/Home/End column keyboard navigation, selected-option scrolling, inherited size/disabled/Form validation. No native time/select input. The range panel explicitly identifies the endpoint on narrow screens.

ColorPicker uses one shared ColorPickerPanel with pointer/keyboard saturation/value editing, native range sliders for hue/alpha (no native color popup), HEX/RGB/HSL text parsing, invalid text feedback, presets, explicit confirm/cancel, clear to empty string, Form integration, readonly/disabled, theme, size and semantic borders/focus/confirm. Outputs canonical #rrggbb or #rrggbbaa. Pointer capture is cleaned up. Conversion rounds floating point half-channel values consistently.

DatePickerPanel adds an internal inline flag to existing DatePickerBase (coordinator authorized). Existing default popup behavior remains unchanged. Inline mode skips the trigger/Teleport/overlay branch, reuses draft, ranges, disabled dates, holidays, keyboard and year/month navigation, uses relative sizing and remains mounted after selection. Single dates commit on click; ranges commit on the second endpoint. New panel docs describe these exact semantics. All existing date tests pass.

Each of four new pages contains Basic, Advanced, Appearance (all five sizes/light-dark), Status (all six) and Form standalone examples; source imports use the same SFC via ?raw. Existing five entry pages also gained Status examples. Individual type JSDoc is Chinese, including all review-requested missing properties.

## Evidence

- Initial four new suites failed on missing production modules before implementation (RED).
- Focused entry/time/color/date panel set plus existing date tests: 16 suites, 118 tests passed.
- Pointer, keyboard, alpha, invalid input, cancel isolation, disabled candidate skipping, Form size/disabled and inline range/navigation regressions covered.
- Library and site typechecks currently report only external Message runtime generic cast and QR registration issues; no owned files report errors. Coordinator is resolving these shared gates.
- Full integrated build/site API audit/browser review remains coordinator-owned.
