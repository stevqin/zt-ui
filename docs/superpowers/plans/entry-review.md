# Independent entry / time / color / date-panel review

Reviewed Autocomplete, InputTag, Mention, Rate, TimeSelect, TimePicker, ColorPicker, ColorPickerPanel and DatePickerPanel, including the shared suggestions cancellation state, color parser, Form inheritance and existing popup date implementation.

Confirmed fixes with red/green regression coverage:

- Mention Home/End selected a suggestion on keydown, then keyup treated the same key as caret movement and re-queried, clearing active suggestion before Enter. `src/components/mention/ZtMention.vue` now limits Home/End caret inspection to when the suggestion list is closed; left/right caret movement still re-queries. Regression sends full keydown/keyup sequence before Enter.
- A syntactically numeric HSL hue beyond finite JS range produced a color containing NaN. `src/components/color-picker/color.ts` now validates finite hue before conversion; malformed input returns null and cannot be committed.

Additional regression checks confirmed: ColorPanel preserves alpha precision in parsed input, rejects invalid text, and emits canonical alpha HEX on valid confirmation. Inline DatePickerPanel stays embedded after select/Escape, omits the combobox trigger, and original DatePicker still opens a teleported dialog normally. No date implementation change was needed.

Existing suites additionally cover suggestion request cancellation/stale failures/unmount and IME; InputTag deduplication/limits; Rate keyboard/half/disabled; time-select boundaries; TimePicker range invalidity, disabled/readonly/Form size, custom rather than native time inputs, keyboard skip; ColorPanel pointer/keyboard/alpha/disabled and palette capture. Coordinator's time-picker reachability test remains passing.

Verification: `npm test -- tests/entry-review.spec.ts tests/time-picker-reachability.spec.ts src/components/autocomplete src/components/input-tag src/components/mention src/components/rate src/components/time-select src/components/time-picker src/components/color-picker src/components/color-picker-panel` → 10 suites / 30 tests passed. `npm run typecheck` passed. New review tests: tests/entry-review.spec.ts (4 tests). No shared registration files changed. Browser mobile/visual checks remain coordinator-owned.
