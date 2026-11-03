# 0.13.0 release notes and demo layout

- Date: 2026-11-03.
- Added today's key changes to CHANGELOG.md: icon expansion/motion, AvatarGroup and business-item callbacks, Form validation placement, Carousel/Splitter/Segmented/Image transitions, Descriptions, InfiniteScroll, ColorPicker appearance/spectrum, Tour alignment, Backtop positioning and demo/navigation improvements.
- Kept historical release content intact. The Markdown file is the single source for version/category content and navigation; parsing ignores headings inside fences and excludes executable comparison URLs. Rich bodies continue through the sanitized Markdown renderer.
- Redesigned the page with version/date reading rails, latest summary, category sections, desktop active version navigation and narrow-screen version links. Inspected desktop light and 320px dark screenshots.
- Synchronized library package.json, root lock metadata and the site's local dependency lock metadata to 0.13.0. The initial notes-preparation step did not publish, deploy, commit or create a tag.

## Validation

- Full library run: 2,121 passed and one obsolete assertion failed because it still excluded ColorPicker from underline support. Replaced that assertion with a Form inheritance regression. The final core/public underline rerun passed all 121 tests; production code did not change after the full run.
- Full site suite: 21 files / 530 tests passed. Focused parser/version metadata rerun: 3 passed.
- Final Edge release-page checks: 5 passed, including historical Markdown/links, sanitization, desktop anchor navigation/active state, and narrow dark layout/version navigation.
- Library and site production builds/typechecks passed. Source-derived API extraction and standalone example/content checks passed in the site build.
- Scoped whitespace checks passed.


## Bilingual publication preparation

- Added CHANGELOG.en.md with all17 English entries corresponding to the Chinese0.13.0 notes. Both READMEs provide bilingual highlights and direct links to the complete logs.
- npm package allowlist includes both changelogs and both READMEs. The dry-run package contained all required ESM/UMD/CSS/declaration/Canvas artifacts and the third-party notices.
- Final full release-candidate regression:184 library files /2,122 tests passed;21 site files /530 tests passed. Public API/content extraction and production builds were rerun before publication.
