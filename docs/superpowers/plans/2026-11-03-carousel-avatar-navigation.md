# Carousel, Avatar and pinned navigation refinement

User scope: fix Carousel behavior and missing switch motion; refine Avatar and add avatar groups; join the pinned navigation background to the site header and fade the underlying menu through frosted glass, keeping the existing group coordinates.

Independent component work was delegated with separate source/demo/test ownership; root owns sidebar, public API docs, contract matrix, generation and integration verification. Existing unrelated icon/Form/Splitter/InfiniteScroll changes remain intact.

Carousel now uses directional slide transitions with persistent slide DOM and inert inactive panels. Fixes cover loop direction, rapid changes, dynamic slide removal, vertical swipe rejection, focus recovery and autoplay timing. Active slide stays in flow so CSS auto heights work. Demos use actual distinct slide colors and clear state captions.

Avatar uses corrected theme tokens, precise sizes, image/srcSet fallback and grapheme initials. AvatarGroup supports inherited size/shape, max-visible +N overflow, named/focusable member popover, scrolling, Escape restoration and native root attribute forwarding. The generated public API and component audit include Group.

Pinned navigation baseline at1440px: header bottom64px; sidebar padding-top24px; group x16,y88,width231,height42. All layout coordinates, padding and sticky top remain unchanged. A pinned-only absolute background paints24px above and fades26px below with masked backdrop blur. RAF-batched scroll/resize observation identifies the pinned group and cleans up on unmount. Pseudo-layer is pointer-transparent; normal group headings and mobile menu retain existing behavior.

Review caught and fixed auto-height collapse, overflow keyboard focus/naming and native attribute loss. Browser checks measure real animation intermediate frames, wrapping/reversal, reduced motion, five Avatar sizes, actual overflow scrolling, theme/mobile fit and unchanged pinned heading geometry. Public API audit reports411 components with zero unwaived violations. Final builds and33 focused tests passed;28 integrated browser checks passed. Final whole-suite results:182 library files /2108 tests passed;19 documentation files /525 tests passed. Both final builds passed; production preview verified AvatarGroup API/overflow, Carousel navigation and pinned group y88. All28 integrated browser checks passed again on the final source in a clean auto-managed server run (exit0), after native attribute forwarding. The full runs also refreshed two stale demo-test expectations to the existing Form segmented position control and new Carousel caption.


## Avatar overflow panel and compact overlap follow-up

User reported that the overflow panel was unfriendly once a scrollbar appeared. Browser reproduction measured an intrinsic width of only112px. The panel now has a responsive264px content width, fixed group title and remaining count, comfortably padded member rows, truncated long labels with complete title text, and one dedicated scroll region. Its thin scrollbar reserves space; overscroll is contained so reaching the end does not move the document. Panel height adapts to short viewports, with the shared Popover content prevented from becoming a second scroller. Keyboard list focus and Escape return remain intact.

User then requested right avatars to cover left avatars, leaving only one-quarter to one-third visible. Group negative margins now overlap70%, leaving30% at every preset size. DOM paint order keeps right avatars and the final +N button in front; pointer hover no longer reverses the stack.

Verification: new panel browser regressions first failed at the112px width, and the compact-overlap regression first failed at75% exposure. Final16 targeted library units,20 site example checks and6 Edge browser checks passed. Browser checks cover all five preset sizes, actual right-avatar hit/paint order, keyboard navigation, single-list scrolling, contained wheel scrolling, fixed header,320px portrait and320px landscape height, dark styling and popup dismissal. Both production builds/typechecks passed. Compact group and overflow panel screenshots inspected; scoped whitespace checks passed.


## Avatar card hover and continuous pointer sweep

User changed exposure to40% and requested raised, fully visible members with names and animated return. Native hover on the raised full-width avatar then covered adjacent members, skipping the middle member during horizontal motion. A new browser regression reproduced the missing middle member name. The group now resolves the pointed member from the original item positions and exposed strips, independent of the raised avatar's hit target. The active card gets the foreground layer immediately while previous cards animate back; transforms affect only the visual avatar, preserving layout and pointer geometry. Private manual name popovers reuse the shared tooltip surface and expose aria-describedby, keyboard focus and Escape dismissal. Reduced motion disables transitions. Exposure remains40%.

Final verification:16 targeted Avatar library tests and8 Edge browser checks passed, including forward/reverse sweeps across every member, measured intermediate return animation, complete foreground hit visibility, five sizes, keyboard/name dismissal, reduced motion and previous overflow-panel regressions. Both production builds/typechecks and scoped whitespace checks passed.


## Remove hover names and expose overflow-member clicks

User requested removal of member-name hover hints while preserving the card interaction, plus click events on members inside the more panel. Removed private name popovers and their dismissal state, retaining stable pointer-slot tracking, keyboard focus and40% exposure. Overflow rows are now native buttons with hover/press/focus feedback. The public member-click(index,event) event returns the zero-based index in the complete flattened avatar list and the native MouseEvent; it does not automatically dismiss the panel. The Basic demo resolves team[index] and displays the selected member. API metadata includes the documented event.

A new event regression first failed because the panel had no member buttons. Final17 focused library tests and9 Edge browser checks passed, covering one event from an inner-avatar click, original indices, mouse/Enter/Space activation, no hover tooltip, continuous card sweep, animation and prior overflow-panel regressions. Both production builds/typechecks and scoped whitespace checks passed.


## Complete member list in the more panel

User requested that the more panel also include the members already shown within max. The panel now renders all flattened members in original order, cloning avatar VNodes for the separate panel location. max only limits the inline stack; +N continues to show the collapsed count. The trigger accessibility label, dialog/list names, header count, prop documentation and demo now describe the complete member list. member-click continues to return the original zero-based index, including index0 for the first inline member.

Two adjusted unit checks failed before implementation. Final17 targeted units and9 Edge browser checks passed, verifying all panel members, unchanged inline max, first/last member click mapping, keyboard activation, card sweep and overflow scrolling. Library and documentation production builds/typechecks plus scoped whitespace checks passed.


## Return the business member object from click callbacks

User requested the concrete item instead of an index-only callback. ZtAvatar now accepts optional item: ZtAvatarItem (a business record), consumed as a prop rather than rendered as a DOM attribute. AvatarGroup member-click now emits (item,index,event), returning the exact bound item reference; avatars without item return their VNode props as a documented fallback. The index remains the complete-list zero-based position. The Basic demo binds each member via :item and reads item.name directly. Public type exports and generated API reflect the new signature.

Two new/updated regressions failed before implementation, including object leakage to the DOM. Final18 targeted units and9 Edge browser checks passed. Tests verify fallback avatar props, original object identity and custom fields, reorder correctness, no DOM object attribute, native click and keyboard selection, plus previous card/overflow behavior. Both production builds/typechecks and scoped whitespace checks passed.
