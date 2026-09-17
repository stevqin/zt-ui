# Structured data implementation report

Implemented and exported ZtTable, ZtTimeline, ZtCalendar through their feature directories; shared exports remain coordinator-owned.

Table: native semantic table, stable required row key resolution (default id), column widths/alignment/formatter/named header and cell slots, stable local sorting, controlled or internal sort state, remote sort-only events, controlled selection with half/select-all and nonselectable rows, controlled expansion slots, scroll height/sticky headers/multiple fixed columns with accumulated offsets, empty/loading states, stripe/border, size/theme inheritance. Invalid missing row keys throw a clear error to avoid unstable row identity. Unknown selected keys are retained on select-all. Events: update:selectedKeys(keys), selection-change(currentDataSelectedRows), update:expandedKeys(keys), expand-change(row,expanded), update:sort(sort), sort-change(sort), row-click(row,event). Types ZtTableKey/Row/SortOrder/Sort/Column/Props.

Timeline: ordered list, time/content/status/custom node/content slots, reverse without input mutation, left/right/alternate positioning, responsive single column at 480px, theme/size. Types ZtTimelineStatus/Item/Props.

Calendar: reuses existing date-picker date utilities; month (42 dates) and week (7 dates), controlled selected local date and optionally controlled view, month/week previous/next/today toolbar, inclusive range with invalid/reversed disabling, callback disabled dates, holidays, custom header/date-cell slots, keyboard arrows/Home/End/PageUp/PageDown with focus tracking. Date navigation does not mutate controlled selection. Types ZtCalendarView/Props/Cell. Events update:modelValue(dateString), change(dateString,Date), update:view(view), panel-change(anchorDate,view).

Tests-first: initial all-three suite run failed for missing SFC modules; final 13 focused tests pass (Table 6, Timeline 2, Calendar 5). Combined hierarchy+data 7 suites / 31 tests pass. Root npm run typecheck passes. Basic + Advanced source-matched runnable demos for each, with ?raw imports; all Props precisely documented in Chinese JSDoc. API reference is centrally provided by site App.
