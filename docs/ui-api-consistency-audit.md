# Public component contract audit

All value exports reachable from src/index.ts are inventoried, including named/default barrel imports and aliases, the VTableGrid JS bridge, and named SVG icons: **126 components (94 SFCs + 32 SVG icons)**. Helpers, types and registry objects are not components.

Run `npm run audit:components`. There are no waived findings. New exports, absent rows, unresolved dispositions, missing evidence, and failed source/metadata checks exit nonzero. Static checks are combined with the behavioral/computed-style suites listed per row; this is not a claim of exhaustive browser accessibility certification.

## Contract legend

- Density: **inherited** uses useZtSize (explicit size, nearest form/group, ConfigProvider); **delegated** forwards to a density owner; **intrinsic** is numeric/CSS geometry (Icon/Avatar/QRCode/SVG); **provider** establishes the boundary; **structural** has no interactive density API (Alert intentionally keeps its established display density).
- Radius/depth: **tokens** consumes or establishes glass.radius / --zt-radius; **delegated** uses its control/surface owner; **intrinsic** is a circle/pill, separator, canvas, bare SVG or unboxed layout. Button's radius-dependent depth has dedicated computed-style coverage. No blanket elevation redesign is authorized.
- Status: **visual** is the six-color family with danger; **validation** retains error; **mixed** is the approved DatePicker/InputOtp family with both meanings; **workflow** and **result** retain domain vocabulary; **none** adds no status prop. Timeline item status and upload-file status keep their documented item contracts.
- Interaction: **native** retains native keyboard/focus semantics; **keyboard** owns a composite model; **delegated** uses a nested control; **structural** is passive display or context; **decorative-svg** shares strokeWidth/SVG attributes and takes naming/decorative semantics from ZtIcon or its caller. Disabled, readonly, loading and validation apply where supported. Animated families must support reduced motion.
- Overlay: **modal** uses shared focus/stack/body-lock ownership; **anchored** uses shared dropdown geometry/branches; **delegated** uses a child overlay; **owned-popup** registers a Menu/VTable popup as a shared overlay branch while retaining its established placement; **status-mask** is Loading’s noninteractive status layer; **local-tooltip** is the noninteractive FormItem validation hint; **none** has no overlay. Shared evidence: tests/use-overlay.spec.ts, tests/overlay-popup-layer.spec.ts, tests/overlay-local-boundary.spec.ts, tests/select-box-viewport.spec.ts and tests/tooltip-sizing.spec.ts.
- API: **public-types** checks common spelling and numeric/CSS dimensions without aliases. Metadata **generated** covers public props; **family:ZtIcon** maps every raw SVG glyph to generated strokeWidth documentation and the shared factory. Raw glyphs have no independent behavior.
- Every row includes source/types/styles review and a checked-in regression suite. The audit checks the evidence files; npm test executes them. Task 2's deferred imported-example/displayed-source audit belongs to Tasks 7/8 and is not claimed complete here.

## Component matrix

| Component | Result | Density | Radius/depth | Status/validation | Interaction/accessibility | Overlay ownership | API language | Metadata | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ZtAddIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtAffix | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/affix/affix.spec.ts |
| ZtAlert | compliant | structural | tokens | visual | native | none | public-types | generated | tests/alert-size.spec.ts |
| ZtAnchor | compliant | structural | intrinsic | none | native | none | public-types | generated | src/components/anchor/anchor.spec.ts |
| ZtArrowDownIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtArrowLeftIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtArrowRightIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtArrowUpIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtAside | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/layout/layout.spec.ts |
| ZtAutocomplete | compliant | delegated | tokens | visual | keyboard | delegated | public-types | generated | src/components/autocomplete/autocomplete.spec.ts |
| ZtAvatar | compliant | intrinsic | tokens | visual | structural | none | public-types | generated | tests/image-avatar.spec.ts |
| ZtBacktop | compliant | inherited | tokens | none | native | none | public-types | generated | src/components/backtop/backtop.spec.ts |
| ZtBadge | compliant | inherited | tokens | visual | structural | none | public-types | generated | tests/display-components.spec.ts |
| ZtBreadcrumb | compliant | inherited | intrinsic | none | structural | none | public-types | generated | tests/breadcrumb-segmented.spec.ts |
| ZtBreadcrumbItem | compliant | structural | intrinsic | none | native | none | public-types | generated | tests/breadcrumb-segmented.spec.ts |
| ZtButton | compliant | inherited | tokens | visual | native | none | public-types | generated | tests/button-radius-depth.spec.ts |
| ZtCalendar | compliant | inherited | tokens | none | keyboard | none | public-types | generated | src/components/calendar/calendar.spec.ts |
| ZtCalendarIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtCard | compliant | inherited | tokens | none | structural | none | public-types | generated | src/components/card/card.spec.ts |
| ZtCarousel | compliant | structural | tokens | none | keyboard | none | public-types | generated | src/components/carousel/carousel.spec.ts |
| ZtCascader | compliant | inherited | delegated | visual | keyboard | delegated | public-types | generated | src/components/cascader/cascader.spec.ts |
| ZtCheckbox | fixed | inherited | tokens | visual | checkbox | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtCheckboxGroup | fixed | inherited | tokens | visual | structural | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtCheckIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtChecklistIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtChevronDownIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtChevronLeftIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtChevronRightIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtChevronUpIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtClipboardIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtCloseIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtCol | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/col/col.spec.ts |
| ZtCollapse | fixed | inherited | intrinsic | none | structural | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtCollapseItem | fixed | structural | intrinsic | none | native | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtColorPicker | compliant | inherited | tokens | visual | native | delegated | public-types | generated | src/components/color-picker/color-picker.spec.ts |
| ZtColorPickerPanel | compliant | inherited | tokens | visual | keyboard | none | public-types | generated | src/components/color-picker-panel/color-picker-panel.spec.ts |
| ZtConfigProvider | compliant | provider | tokens | none | structural | none | public-types | generated | tests/config-provider.spec.ts |
| ZtDatePicker | compliant | delegated | tokens | mixed | delegated | delegated | public-types | generated | tests/date-picker.spec.ts |
| ZtDatePickerPanel | compliant | delegated | tokens | mixed | delegated | delegated | public-types | generated | tests/date-picker.spec.ts |
| ZtDateTimePicker | compliant | delegated | tokens | mixed | delegated | delegated | public-types | generated | tests/date-picker.spec.ts |
| ZtDeleteIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtDescriptions | compliant | inherited | tokens | none | structural | none | public-types | generated | tests/display-components.spec.ts |
| ZtDescriptionsItem | compliant | structural | tokens | none | structural | none | public-types | generated | tests/display-components.spec.ts |
| ZtDivider | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/divider/divider.spec.ts |
| ZtDownloadIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtDrawer | compliant | inherited | tokens | none | keyboard | modal | public-types | generated | tests/drawer.spec.ts |
| ZtDropdown | compliant | inherited | tokens | none | keyboard | delegated | public-types | generated | tests/selection-dropdown.spec.ts |
| ZtEditIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtEmpty | compliant | inherited | intrinsic | none | structural | none | public-types | generated | src/components/empty/empty.spec.ts |
| ZtErrorIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtFilterListIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtFooter | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/layout/layout.spec.ts |
| ZtForm | compliant | inherited | tokens | none | structural | none | public-types | generated | tests/form-validation.spec.ts |
| ZtFormGroup | compliant | structural | tokens | none | structural | none | public-types | generated | tests/form-validation.spec.ts |
| ZtFormItem | compliant | inherited | tokens | none | native | local-tooltip | public-types | generated | tests/form-validation.spec.ts |
| ZtHeader | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/layout/layout.spec.ts |
| ZtHomeIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtIcon | compliant | intrinsic | intrinsic | visual | structural | none | public-types | generated | tests/icon.spec.ts |
| ZtImage | fixed | structural | tokens | none | keyboard | delegated | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtImageIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtImageViewer | fixed | structural | tokens | none | keyboard | modal | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtInfiniteScroll | compliant | structural | tokens | none | native | none | public-types | generated | src/components/infinite-scroll/infinite-scroll.spec.ts |
| ZtInfoIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtInput | compliant | inherited | tokens | validation | native | none | public-types | generated | tests/form-underline-core.spec.ts |
| ZtInputNumber | compliant | inherited | tokens | none | keyboard | none | public-types | generated | tests/input-number.spec.ts |
| ZtInputOtp | compliant | inherited | tokens | mixed | keyboard | none | public-types | generated | tests/input-otp.spec.ts |
| ZtInputTag | compliant | inherited | tokens | visual | keyboard | none | public-types | generated | src/components/input-tag/input-tag.spec.ts |
| ZtLayout | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/layout/layout.spec.ts |
| ZtLink | compliant | inherited | tokens | visual | native | none | public-types | generated | tests/link-text.spec.ts |
| ZtLoading | compliant | inherited | intrinsic | none | structural | status-mask | public-types | generated | tests/feedback-css.spec.ts |
| ZtMain | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/layout/layout.spec.ts |
| ZtMention | compliant | inherited | tokens | visual | keyboard | delegated | public-types | generated | src/components/mention/mention.spec.ts |
| ZtMenu | fixed | inherited | tokens | visual | keyboard | owned-popup | public-types | generated | tests/component-contract-interaction.spec.ts, tests/menu.spec.ts, tests/menu-horizontal.spec.ts |
| ZtMinusIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtModal | compliant | inherited | tokens | none | delegated | modal | public-types | generated | tests/modal.spec.ts |
| ZtMoreIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtPageHeader | compliant | inherited | tokens | none | native | none | public-types | generated | src/components/page-header/page-header.spec.ts |
| ZtPagination | compliant | inherited | tokens | visual | keyboard | delegated | public-types | generated | tests/pagination.spec.ts |
| ZtPassword | compliant | inherited | tokens | validation | native | none | public-types | generated | tests/form-underline-core.spec.ts |
| ZtPopconfirm | compliant | structural | tokens | visual | native | delegated | public-types | generated | tests/popconfirm.spec.ts |
| ZtPopover | fixed | structural | tokens | none | delegated | anchored | public-types | generated | tests/tooltip-sizing.spec.ts |
| ZtProgress | compliant | inherited | tokens | visual | structural | none | public-types | generated | tests/slider-progress.spec.ts |
| ZtQRCode | compliant | intrinsic | tokens | none | structural | none | public-types | generated | src/components/qrcode/qrcode.spec.ts |
| ZtRadio | compliant | inherited | tokens | visual | native | none | public-types | generated | tests/form-underline-selection.spec.ts |
| ZtRadioGroup | compliant | inherited | tokens | visual | structural | none | public-types | generated | tests/form-underline-selection.spec.ts |
| ZtRate | compliant | inherited | tokens | visual | keyboard | none | public-types | generated | src/components/rate/rate.spec.ts |
| ZtRefreshIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtResult | compliant | structural | intrinsic | result | structural | none | public-types | generated | tests/display-components.spec.ts |
| ZtRow | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/row/row.spec.ts |
| ZtScrollbar | compliant | inherited | tokens | none | native | none | public-types | generated | tests/scrollbar.spec.ts |
| ZtSearchIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtSegmented | fixed | inherited | tokens | visual | keyboard | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtSelect | compliant | inherited | tokens | none | keyboard | anchored | public-types | generated | tests/select.spec.ts |
| ZtSelectBox | compliant | inherited | tokens | none | keyboard | anchored | public-types | generated | tests/select-box-integration.spec.ts |
| ZtSettingsIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtSkeleton | compliant | structural | tokens | none | structural | none | public-types | generated | src/components/skeleton/skeleton.spec.ts |
| ZtSkeletonItem | compliant | structural | tokens | none | structural | none | public-types | generated | src/components/skeleton/skeleton.spec.ts |
| ZtSlider | compliant | inherited | tokens | visual | keyboard | none | public-types | generated | tests/slider-progress.spec.ts |
| ZtSpace | compliant | inherited | intrinsic | none | structural | none | public-types | generated | src/components/space/space.spec.ts |
| ZtSplitter | compliant | structural | tokens | none | keyboard | none | public-types | generated | src/components/splitter/splitter.spec.ts |
| ZtStatistic | compliant | inherited | intrinsic | none | structural | none | public-types | generated | src/components/statistic/statistic.spec.ts |
| ZtStep | compliant | structural | tokens | workflow | structural | none | public-types | generated | tests/steps.spec.ts |
| ZtSteps | compliant | inherited | tokens | none | structural | none | public-types | generated | tests/steps.spec.ts |
| ZtSuccessIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtSwitch | fixed | inherited | intrinsic | visual | switch | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtTable | compliant | inherited | tokens | none | native | none | public-types | generated | src/components/table/table.spec.ts |
| ZtTabPane | compliant | structural | tokens | none | structural | none | public-types | generated | tests/tabs.spec.ts |
| ZtTabs | compliant | inherited | tokens | visual | keyboard | none | public-types | generated | tests/tabs.spec.ts |
| ZtTag | fixed | inherited | tokens | visual | native | none | public-types | generated | tests/component-contract-interaction.spec.ts |
| ZtText | compliant | inherited | tokens | visual | structural | none | public-types | generated | tests/link-text.spec.ts |
| ZtTimeline | compliant | inherited | intrinsic | none | structural | none | public-types | generated | src/components/timeline/timeline.spec.ts |
| ZtTimePicker | compliant | inherited | tokens | visual | keyboard | delegated | public-types | generated | src/components/time-picker/time-picker.spec.ts |
| ZtTimeSelect | compliant | delegated | delegated | visual | delegated | delegated | public-types | generated | src/components/time-select/time-select.spec.ts |
| ZtTooltip | fixed | structural | tokens | none | keyboard | delegated | public-types | generated | tests/tooltip-sizing.spec.ts |
| ZtTour | compliant | structural | tokens | none | native | modal | public-types | generated | src/components/tour/tour.spec.ts |
| ZtTransfer | compliant | inherited | tokens | visual | native | none | public-types | generated | src/components/transfer/transfer.spec.ts |
| ZtTree | compliant | inherited | tokens | visual | keyboard | none | public-types | generated | src/components/tree/tree.spec.ts |
| ZtTreeSelect | compliant | inherited | tokens | visual | keyboard | delegated | public-types | generated | src/components/tree-select/tree-select.spec.ts |
| ZtTypography | compliant | inherited | tokens | visual | native | none | public-types | generated | src/components/typography/typography.spec.ts |
| ZtUpload | compliant | inherited | tokens | visual | native | delegated | public-types | generated | tests/upload.spec.ts |
| ZtUploadIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtUserIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtVisibilityIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtVTableGrid | fixed | inherited | tokens | none | keyboard | owned-popup | public-types | generated | tests/vtable-grid.spec.ts |
| ZtWarningIcon | compliant | intrinsic | intrinsic | none | decorative-svg | none | public-types | family:ZtIcon | tests/icon.spec.ts |
| ZtWatermark | compliant | structural | intrinsic | none | structural | none | public-types | generated | src/components/watermark/watermark.spec.ts |

## Baseline findings and remediation

All findings below are **Important**, now fixed; no Critical or Important finding remains and none is waived.

| Component/family | Evidence before remediation | Required contract | Focused change / regression |
| --- | --- | --- | --- |
| Checkbox | Native input had unconditional tabindex=-1 and no change handler; indeterminate was only painted, not reflected in native state (checkbox/ZtCheckbox.vue). | Focusable native checkbox, announced mixed state, one change per action. | Restore native change/tab semantics and DOM indeterminate; reconcile checked/indeterminate after accepted or rejected group min/max toggles; preserve explicitly role-owning SelectBox wrappers. component-contract-interaction.spec.ts and existing SelectBox suites. |
| Checkbox/CheckboxGroup | Disabled large Form yielded enabled default-density checkboxes (checkbox/ZtCheckbox.vue, ZtCheckboxGroup.vue). | FormItem disabled/density inheritance below an explicit control/group override. | Use the existing FormItem context and shared density resolver; block disabled group mutations. Behavioral Form regression. |
| Switch | Nonfocusable div with role=switch had no keyboard handler or disabled/busy announcement; ignored FormItem density/disabled (switch/ZtSwitch.vue). | Keyboard activation, state announcements, disabled/loading mutation guard and inherited Form contract. | Add Space/Enter and resolved disabled state; preserve status and shape APIs. Behavioral keyboard and Form regressions. |
| Tag | Closable tag rendered an unnamed click-only span (tag/ZtTag.vue). | Independently focusable named close action. | Native button with Chinese label, neutral style reset, focus-visible ring. Behavioral close regression. |
| Collapse / Segmented / Image | Transitions had no reduced-motion override (collapse/collapse.scss, segmented/segmented.scss, image/image.scss). | Respect reduced motion without removing state changes. | Add only transition:none in the reduced-motion media query. Compiled production Sass computed-style regression covers CollapseItem, Segmented, Image mask and ImageViewer image. |
| ImageViewer | All open viewers consumed document navigation/Escape; standalone viewer did not trap or restore focus (image/ZtImageViewer.vue). | Top-overlay ownership, focus trap, opener restoration, scroll lock. | Reuse useOverlay; retain synchronous viewer close API and top-owned navigation. Stacked viewer/modal and focus regressions. |
| Menu | Double/ horizontal flyout focus was recaptured by a containing Modal and flyout lacked inherited z-index (menu/ZtMenu.vue, ZtMenuHorizontalNode.vue). | Teleported child stays in parent overlay focus/layer scope; Escape closes only child. | Register through useAnchoredDropdown and pass its scope to nested horizontal branches; retain side-placement geometry. Both modes tested in a z-index 9000 Modal. |
| VTableGrid | Escape in column settings reached parent Modal first; settings focus did not return to its trigger (vtable-grid/ZtVTableGrid.vue). | Inline interactive settings remain an owned child focus range. | Register through useAnchoredDropdown and restore trigger on local Escape. Regression uses the real settings UI with the existing canvas-engine boundary double. |
| Popover / Tooltip metadata | Generated API omitted Popover.height and Tooltip.width/height introduced by Task 5. | Public props and generated metadata agree. | Run existing site generator; no generator changes or hand-edited JSON. Gate mutation test verifies missing props fail. |

The first complete command reported 11 violations (including separate component rows sharing animated styles). Continued source review added the Tag close-action and Menu/VTable overlay findings; behavioral tests additionally proved Form inheritance/mixed-state omissions. Each received a failing regression before its source change.

The full suite also exposed an obsolete RadioGroup.variant expectation left by Task 2, corrected to assert the alias remains inert, and a VTable test dispatching a synthetic click on Checkbox’s private decorative span, updated to manipulate the public native input. These changes preserve the approved API and test observable user-facing behavior.

## Verification scope

The mutation-tested gate enforces export coverage, approved dimension values, evidence-file existence, density inheritance/vocabulary, token-based radius, distinct status families, animated-family reduced motion, concrete action/overlay ownership rules, common boolean/name/length contracts, generated prop coverage/type/requiredness agreement for every public prop, and forbidden compatibility guidance. All 32 glyph rows must map to the shared generated ZtIcon strokeWidth contract.

Family regressions verify native and composite keyboard interaction, disabled/readonly/loading behavior where supported, semantic validation priority, provider inheritance, adjoining control geometry and popup scroll ownership. The library-wide browser visual matrix and documentation example/source parity remain the final verification/site tasks in the approved plan. No site restructuring, new status props, public status renaming, or broad visual redesign is included here.
