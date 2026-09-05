---
name: Super Sauce Iraq
description: A bold Arabic restaurant campaign in red, butter yellow, and warm cream.
colors:
  red: "#ce1725"
  red-dark: "#a6101c"
  yellow: "#ffe044"
  cream: "#faf7ef"
  paper: "#f2ece1"
  ink: "#26221f"
  muted: "#6c6259"
  line: "#e1d9cd"
  white: "#fff"
  surface: "#fffdf8"
typography:
  display:
    fontFamily: "Alexandria Variable, sans-serif"
    fontWeight: 850
    lineHeight: 1.5
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "37px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Alexandria Variable, sans-serif"
    fontSize: "17px"
    fontWeight: 750
    lineHeight: 1.5
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
  tag: "4px"
  field: "6px"
  button: "7px"
  panel: "10px"
  media: "12px"
  circle: "50%"
spacing:
  compact: "8px"
  small: "12px"
  control: "16px"
  medium: "20px"
  large: "24px"
  group: "32px"
  block: "40px"
  section-mobile: "66px"
  section-desktop: "104px"
components:
  button-red:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 24px"
  button-red-hover:
    backgroundColor: "{colors.red-dark}"
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 24px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 24px"
  text-field:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 13px"
  search-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 17px"
  navigation-link:
    textColor: "{colors.ink}"
  category-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "9px 23px"
  category-tab-active:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.field}"
    padding: "9px 23px"
  branch-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "27px"
  brand-star:
    size: "30px"
---

# Design System: Super Sauce Iraq

## Overview

**Creative North Star: "The Iraqi Restaurant Campaign"**

A food-first Arabic identity with saturated campaign fields, oversized confident type, warm paper surfaces, and the supplied Super Sauce logo. Large food photography creates appetite; quieter navigation, browsing, and forms make the next action easy to find.

The recognizable materials are butter-yellow stars, red and cream blocks, and checkerboard seams. Use those materials across new surfaces without copying the homepage composition into every page. This records the completed implementation, including the corrected muted text and focus colors; the visual authority is the supplied identity, not a separate approved page composition.

**Key Characteristics:**

- Arabic RTL with Alexandria throughout.
- Strong red fields, warm neutral browsing surfaces, and yellow campaign actions.
- Food photography, five-point stars, and checkerboard seams.
- Flat cards, subtle borders, and brief interaction motion.

## Colors

The palette combines restaurant-sign red and butter yellow with warm paper neutrals. The frontmatter owns the exact values; the names below describe their use.

### Primary

- **Campaign Red** (`red`): campaign backgrounds, links, prices, selected filters, and primary actions on neutral surfaces.
- **Deep Red** (`red-dark`): red button hover and stronger red text.

### Secondary

- **Butter Yellow** (`yellow`): stars, emphasis inside large red headlines, campaign CTAs, and closing bands.

### Neutral

- **Warm Cream** (`cream`): page and navigation canvas; light text on red.
- **Paper** (`paper`): secondary panels, media backgrounds, and neutral hover fills.
- **Ink** (`ink`): main text, dark buttons, and footer.
- **Muted Brown** (`muted`): supporting text, placeholders, and secondary information.
- **Warm Line** (`line`): dividers and component borders.
- **White** (`white`): high-contrast control text and search fields.
- **Light Surface** (`surface`): branch cards, forms, and order summaries.

**The Contrast-by-Surface Rule.** Use ink on yellow and cream, light text on red, and yellow keyboard outlines for links on red campaign fields.

## Typography

Alexandria Variable is locally imported and serves display, body, controls, and Arabic labels. Weight and scale create hierarchy within one family. Headings are balanced; paragraphs retain generous Arabic line spacing.

- **Display:** heavy campaign and page titles. Standard page introductions use (54px), reducing to (36px) on mobile; red branch introductions use (32px). The homepage has its own responsive larger display composition.
- **Headline:** section titles use the headline token, reducing to (28px) on mobile.
- **Title:** product names use the title token; larger information headings vary with their panel.
- **Body:** the base body token supports reading. Component descriptions commonly use (11–14px) with generous line height; do not treat the smallest promotional text as a general body size.
- **Label and button:** compact, moderately heavy Arabic controls. Keep numbers and telephone inputs directionally isolated when they read left to right. Prices use tabular numerals.

**The Arabic Rhythm Rule.** Keep Arabic reading order, comfortable line height, and strong weight contrast; do not compress the type to imitate a Latin display layout.

## Layout

The shared centered container has a maximum width of (1320px). Its outer gutters are (56px), becoming (32px) at widths up to (1150px) and (20px) at widths up to (760px). Standard section spacing uses the desktop and mobile section tokens.

The desktop homepage pairs a large right-hand Arabic headline with a left-hand burger on red. At (760px) and below, the headline and actions center above the image. This is a homepage expression, not a required page template.

Product grids use four columns, then two at (900px); mobile retains two compact product columns. Branch grids progress from three to two to one. Forms and order layouts collapse to one column at (760px); the order summary stops being sticky there. Category controls scroll horizontally rather than squeeze their labels.

Use logical alignment and spacing for RTL. The navigation stays sticky: (96px) tall on desktop and (78px) on mobile. Major responsive boundaries are (1550px), (1150px), (900px), (760px), and (380px).

## Elevation & Depth

The page is flat by default. Color fields, borders, photography, and generous separation carry depth. Branch cards lift slightly on hover; food images gently scale within clipped frames. Shadows are reserved for temporary UI: the mobile menu and basket toast. Selected fulfillment choices use an inset red stroke.

**The Quiet Utility Rule.** Keep browsing cards and forms visually calm so the red campaign fields and food imagery remain dominant.

Exact shadows and motion values live in the sidecar. State transitions are brief; reduced-motion mode removes smooth scrolling and reduces animations and transitions to near-instant changes.

## Shapes

Controls have gently rounded rectangular edges. Fields and category tabs use the field radius; buttons and search use the button radius. Branch panels use the panel radius, while large media and forms generally use the media radius. Circular geometry belongs to icon actions and small badges.

The five-point brand star is an SVG silhouette from the shared brand component, used filled or outlined. Checkerboard seams alternate red and cream in a (30px) tile, reducing to (22px) on mobile. Campaign images may be tilted or masked; utility panels remain aligned.

## Components

### Buttons

Confident and compact, with centered text and an SVG icon. Standard buttons have a minimum height of (52px), with the frontmatter padding and typography. Red serves neutral surfaces, yellow serves red campaign surfaces, dark serves yellow bands, and outlined buttons provide secondary actions.

Hover raises buttons by (2px) and changes the fill. Keyboard focus uses a (3px) outline with a (5px) offset; links on red fields switch the outline to yellow. Disabled controls dim and show a disabled cursor. Circular add and favorite controls retain at least (44px) targets.

### Chips

Category tabs are small rounded rectangles with light borders. Selection uses a red fill and white text, paired with `aria-pressed`. Inactive hover uses paper. Selected favorites use the same red state language.

### Cards / Containers

Food cards have no enclosing box: a rounded image sits over the name, description, and divided price/action row. Preserve image cropping and consistent text alignment. Branch cards use a light surface, thin warm border, and a small hover lift; their footer separates navigation and map actions. Forms and summaries reuse the same quiet surface vocabulary.

### Inputs / Fields

Visible labels sit above cream fields with warm borders. Focus changes the border to red; invalid fields add a pale red fill and adjacent error text. Search is a white joined icon/input container with a red focus-within border. Inputs, select menus, and textareas keep their native semantics.

### Navigation

The supplied logo anchors the right side of the cream header. Desktop links use red hover and a short red active underline. The basket and ordering action stay visible. Mobile switches to a toggle and a stacked cream panel with divided links; Escape closes it and returns focus to the toggle.

### Brand Star and Campaign Seams

Reuse the existing five-point path, not a text glyph. Filled yellow stars punctuate red campaigns; red stars punctuate cream or yellow. Outlined stars recede behind copy. Keep checkerboard seams as boundaries between campaign fields and the next surface.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied Super Sauce logo and Arabic RTL reading order.
- **Do** reuse the red, yellow, cream, and warm neutral roles before adding colors.
- **Do** give food photography room and keep product information easy to scan.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** use the shared SVG star and simple borders as recurring brand materials.

### Don't:

- **Don't** use yellow for small text on cream or red focus outlines against red fields.
- **Don't** turn every informational surface into a red campaign panel.
- **Don't** add ambient shadows to ordinary cards or forms.
- **Don't** replace the logo or star silhouette with generic text or icon glyphs.
- **Don't** reuse the smallest promotional annotations as body typography.
