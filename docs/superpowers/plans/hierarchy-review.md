# Independent hierarchy/data review

Reviewed Tree, Cascader, TreeSelect, Transfer, Table, Timeline and Calendar implementations, public types, component styles and focused tests against the approved specification. Reviewed controlled ownership, disabled handling, lazy response epochs, keyboard and ARIA behavior, virtual windows, Form validation, theme/size tokens and Table slot contracts.

## Confirmed and fixed

1. Tree ArrowRight advanced on leaf nodes instead of preserving focus. It now only enters an expanded branch's enabled direct child.
2. Tree ArrowRight could focus a disabled first child and cause Enter to select an unrelated enabled row. Disabled children are skipped.
3. Manually scrolling a virtual Tree left aria-activedescendant referencing an unmounted item. The attribute is now present only when the active row is mounted; keyboard navigation still brings focused rows into the window.
4. Cascader checkbox/radio DOM state changed before its controlled model was accepted. Change handling now restores all check controls to the current prop selection, including native radio-group side effects.
5. Cascader ArrowRight on a leaf committed selection unexpectedly. It now opens branches only; Enter/click remains the explicit selection action.
6. TreeSelect lazy failures from replaced data still emitted load-error. The existing epoch now suppresses obsolete failure events as well as cache writes.
7. Cascader and TreeSelect did not run blur validation when users tabbed past an unopened field. Composite focusout handling now validates when focus leaves both host and popup.
8. Cascader did not link its combobox to Form error text. Added aria-describedby.
9. Transfer validated blur when focus moved between internal controls and omitted the group's error association. It now validates only when focus leaves and exposes a labeled group with aria-invalid/describedby.
10. Cascader's teleported panel did not inherit size; added panel size classes/token styles. Across the seven components, font sizes now use the existing five --zt-size-* tokens with matching fallback sizes instead of a second hardcoded scale.

Six initial behavioral regression tests failed before fixes (/tmp/hierarchy-review-red.log); four Form/panel tests then failed before their fixes (/tmp/hierarchy-form-red.log).

## Verification

`PATH=/Users/stev/.nvm/versions/node/v22.15.0/bin:$PATH npm test -- src/components/{tree,cascader,tree-select,transfer,table,timeline,calendar}`: **7 files, 41 tests passed**.

Existing passing tests cover Table controlled/local/remote sort, disabled row selection, expanded rows, header/cell slots and fixed offsets; Timeline reversed order, semantic status and node slot; Calendar leap month, controlled selection, date ranges/invalid bounds, holidays, view switch and keyboard month-crossing focus. No confirmed logic change was needed in these three components beyond shared size token alignment.

`npm run typecheck` passed; complete output: /tmp/hierarchy-review-typecheck.log. Site-wide and browser visual verification remain with the coordinator. No shared exports, API metadata, dependencies, catalog or router edits made.
