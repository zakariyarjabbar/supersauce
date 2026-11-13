---
name: Super Sauce Iraq
description: A burgundy-and-gold Iraqi restaurant campaign built around the Super Sauce hero.
colors:
  burgundy: "#681e32"
  burgundy-deep: "#41121f"
  gold: "#ffc629"
  gold-light: "#ffda68"
  cream: "#fbf2e1"
  paper: "#f2e4cd"
  surface: "#fff9ee"
  ink: "#29141a"
  muted: "#6d514e"
  line: "#ddcbb4"
  line-strong: "#ae887b"
  white: "#fff"
typography:
  display:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "clamp(3.35rem, 6.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 1.22
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "37px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  button:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.8
rounded:
  control: "8px"
  dialog: "12px"
  panel: "14px"
spacing:
  compact: "8px"
  control: "16px"
  button-inline: "24px"
  gutter-mobile: "20px"
  gutter-desktop: "56px"
  section: "104px"
components:
  button-burgundy:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "13px 24px"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "13px 24px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "13px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "13px 24px"
  text-field:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 13px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 17px"
  navigation-link:
    backgroundColor: "{colors.burgundy-deep}"
    textColor: "{colors.cream}"
  category-tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 23px"
  category-tab-active:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.cream}"
    rounded: "{rounded.control}"
    padding: "9px 23px"
  branch-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "27px"
  brand-star:
    size: "30px"
---

# Super Sauce Iraq design system

## Overview

**The Super Sauce hero campaign** brings the new wordmark, gold cape and rounded star into an Arabic restaurant site. Large campaign images create appetite and carry the mascot's story. Food browsing, locations and forms use warm paper tones and clear, quiet controls.

The homepage leads with a cinematic mascot composition, then moves through a gold ribbon, menu cards, food photography and campaign stills. Interior pages borrow the packaging pattern and burgundy accents at a lighter density.

## Colors

- **Burgundy** marks primary actions, links, prices and selected filters. **Deep burgundy** anchors the site header, footer and darker campaign surfaces.
- **Gold** belongs to campaign actions, the star and emphasis against burgundy. Pair gold fills with ink or deep burgundy text.
- **Cream** is the base canvas, **paper** separates sections and **surface** lifts fields or cards. **Ink** carries main text and **muted** carries secondary text. Stronger warm lines define interactive edges.
- Use burgundy focus outlines on light surfaces and gold focus outlines on deep backgrounds. Use cream text on burgundy.

## Typography

Alexandria Variable supports Arabic headings, body text and controls. The homepage display uses weight 900 and a 1.22 line height, with gold emphasis on the final word. Standard body text is 15px with 1.9 line height. Use 12px for form labels and 14px for standard actions. Preserve Arabic reading order and isolate Latin names, telephone numbers and prices when direction requires it.

## Layout

Content uses a 1320px maximum width with 56px desktop gutters, 32px at 1150px and 20px at 760px. The sticky header is 84px high on desktop and 72px on phones.

The hero places the mascot cutout and copy in two columns inside the shared container. The image retains its full transparent silhouette at every size. At 760px and below, the artwork sits above a centered headline and the two primary links. The browser selects a single pre-encoded WebP. Menu grids and utility panels adapt separately to available space. Category filters scroll horizontally and the branch details panel becomes a bottom sheet on phones.

## Elevation & Depth

Use tonal layering, overlapping campaign photos and warm borders. The order dialog lifts above a backdrop. The hero artwork settles into place on entry and food imagery scales subtly on hover. Reduced-motion preferences remove the entrance and shorten the remaining transitions.

## Shapes

Use 8px corners on primary controls and 14px corners on branch and campaign panels. The rounded five-point star appears filled and outlined. Thin rules, the gold ribbon and the wrapper pattern separate larger surfaces.

## Components

- **Wordmark and navigation.** Use the supplied letterforms in the transparent white-and-gold variant on deep burgundy, and the burgundy-and-gold variant on light fields. A gold diamond marks the active desktop link. The mobile menu opens beneath the header.
- **Buttons and filters.** Primary actions on paper are burgundy. Campaign actions are gold. Outlined actions use a strong warm border. Standard actions are at least 52px high and category filters expose selection through `aria-pressed`.
- **Cards and fields.** Product photography sits above the name and price. Branch cards group practical details on an outlined surface. Inputs have visible labels, burgundy focus states and adjacent error copy.
- **Order dialog.** A native dialog pairs a selected item or branch with available contact methods. The summary, channel rows and dividers use the paper palette. Closing returns focus to the trigger.

## Do's and Don'ts

- Keep the traced logo and rounded star intact.
- Give campaign images room and preserve meaningful crops on phones.
- Use cream and ink to keep controls legible while browsing.
- Reserve gold text for surfaces dark enough to give it contrast.
