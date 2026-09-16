# Form and InputNumber Controls Design

## Scope

Extend `ZtInputNumber` with split, left-stacked, and right-stacked controls, then add a lightweight form system consisting of `ZtForm`, `ZtFormItem`, and `ZtFormGroup`. The implementation must stay dependency-free, support Vue 3 and TypeScript, follow the shared five-level component size contract, and include complete copyable site examples.

## InputNumber controls

`controlsPosition` accepts `default`, `left`, or `right`. The default layout keeps decrease on the left and increase on the right. Left and right layouts stack increase above decrease on the selected edge. Control columns are wider than the current height-derived columns so rounded corners do not crowd the symbols, with proportional widths at every size.

## Form architecture

`ZtForm` owns the form model, global rules, layout defaults, disabled state, field registry, and public validation methods. It provides reactive context to descendant form items and renders a native `form` element.

`ZtFormItem` registers itself with its nearest form using `prop`, resolves nested model paths, merges global and local rules, tracks initial value, and owns validation state and message rendering. It provides a small field context so compatible controls can request `change` or `blur` validation.

`ZtFormGroup` is a semantic visual section. It renders a `fieldset` with title and description slots and does not own validation or change the form model.

## Validation contract

Rules support `required`, `min`, `max`, `len`, `pattern`, `type` (`string`, `number`, `email`, `url`), `whitespace`, `trigger`, `message`, and synchronous or asynchronous custom validators. Validation returns a promise and uses first failing rule per field. Custom validators may return `boolean`, `string`, `Error`, `void`, or a promise of those values.

`validate()` resolves to `true` when all registered fields pass and rejects with a field-to-errors map otherwise. `validateField()` validates selected fields using the same result contract. `resetFields()` restores registered fields to their initial values and clears state. `clearValidate()` and `scrollToField()` accept one path, several paths, or no path.

## Form layout and accessibility

Forms support `left`, `right`, and `top` labels, fixed or automatic label width, inline layout, shared size, global disabled state, optional required markers, and configurable message display. Items use `aria-invalid`, `aria-describedby`, stable message IDs, and `role="alert"` for errors. Groups use `fieldset` and `legend` semantics.

## Control integration

`ZtInput` and `ZtInputNumber` notify the enclosing form item after input/change and blur. `ZtPassword` inherits this behavior through `ZtInput`. Explicit form validation remains available for every type of custom child control.

## Documentation and verification

The site adds a Form page covering basic validation, label layouts, inline layout, grouped sections, custom asynchronous validation, disabled state, programmatic methods, and five sizes. InputNumber examples show all three control positions and the wider controls. Verification includes focused red-green tests, the full library and site suites, type checking, production builds, and browser rendering checks.
