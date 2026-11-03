# Reference-based icon adaptations

The user chose small adaptations of mature icon geometry over further freeform redraws after rejecting earlier versions of five glyphs. The following Lucide shapes retain their base structure and proportions. This change is deliberately limited to those five existing names.

| ZtIcon name | Lucide reference | Adaptation |
| --- | --- | --- |
| usb | usb | Endpoint circle radius 1 → 1.15; preserve diagonal stem and branch topology. |
| battery-charging | battery-charging | Frame width +1 to align with the existing battery family; lightning shifted 0.5 and gaps adjusted. |
| phone-missed | phone-missed | Missed-call marker reduced/inset 0.5; retain the reference handset contour. |
| loyalty-points | badge-plus | Plus reduced from 8 to 6 units for more interior spacing. |
| sales-target | goal | Flag reduced/inset; retain the pole and concentric target arcs. |

Sources: https://github.com/lucide-icons/lucide/tree/main/icons

These are derivative geometries, not claimed as wholly original artwork. The existing ISC license text is retained and the mappings/adaptations are recorded in THIRD_PARTY_NOTICES. No new dependency or public API was added. The default 24×24/currentColor/2px round-stroke contract, existing names, animation settings and copy gallery remain in use.

The mature reference geometry is preserved in `site/tests/fixtures/icon-mature-reference.json`; the previous local version in `icon-before-reference-adaptation.json`. Side-by-side reference/adapted rendering at 24px/56px: `/tmp/zt-icon-reference-adapted.png`.

Verification: 336 icon unit tests passed. Browser rendering validates bounds and produces the visual comparison; appearance is judged from that comparison rather than inferred from test success. Final verification: all 12 Edge browser checks passed, including existing animations, copy/search/gallery/mobile/keyboard behavior and the reference comparison. Library ESM/UMD/canvas/declarations and site API/content/type/production builds passed; the existing site large-chunk advisory remains. `git diff --check` is clean.
