---
name: Tiger Auto Parts
description: Dark-locked race livery for a Gent tuning-parts counter; asphalt ground, one tiger-orange stripe carries the page.
colors:
  asphalt: "#090706"
  pit: "#16100e"
  pit-2: "#201916"
  line: "#3a312c"
  bone: "#f4f1ee"
  smoke: "#b3a9a1"
  tiger: "#e75f00"
  tiger-hot: "#ff7417"
  on-tiger: "#090706"
  plate: "#e9e4df"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.75rem)"
    fontWeight: 860
    lineHeight: 0.98
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 118"
  numeral:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5.4vw, 5rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)"
    fontWeight: 900
    lineHeight: 1
    fontVariation: "'wdth' 120"
  title:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.25rem)"
    fontWeight: 850
    lineHeight: 1.1
    fontVariation: "'wdth' 108"
  body:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  label-decal:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 112"
  label-field:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(80px, 11vw, 150px)"
  grid-tight: "14px"
  grid: "18px"
  panel: "20px"
  card: "26px"
  max: "1360px"
  control: "52px"
components:
  button-primary:
    backgroundColor: "{colors.tiger}"
    textColor: "{colors.on-tiger}"
    typography: "{typography.label-decal}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.tiger-hot}"
    textColor: "{colors.on-tiger}"
  button-ink:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.bone}"
    typography: "{typography.label-decal}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "52px"
  button-ink-hover:
    backgroundColor: "{colors.pit-2}"
    textColor: "{colors.bone}"
  chip-brand:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "42px"
  chip-brand-selected:
    backgroundColor: "{colors.tiger}"
    textColor: "{colors.on-tiger}"
  field:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "52px"
  panel-finder:
    backgroundColor: "{colors.pit}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "20px"
  chassis-plate:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.asphalt}"
    typography: "{typography.numeral}"
    rounded: "{rounded.none}"
    padding: "24px 24px 30px"
  chassis-plate-hover:
    backgroundColor: "{colors.tiger}"
    textColor: "{colors.asphalt}"
  card-category:
    backgroundColor: "{colors.pit}"
    textColor: "{colors.bone}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "26px"
  tag:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "6px 11px"
  tag-hover:
    backgroundColor: "{colors.tiger}"
    textColor: "{colors.on-tiger}"
  decal-code:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
---

# Design System: Tiger Auto Parts

## Overview

**Creative North Star: "The Livery"**

The site is dressed like a race car. A wet-asphalt ground carries bone lettering, and a single committed tiger-orange stripe runs the length of the page as a fixed spine, cuts across the hero seam, and floods whole sections when a deal needs to shout. Everything a hand touches is a decal: a parallelogram cut at a fixed slant, its lettering held upright inside. Everything that holds content is a square-cornered panel, like a pit wall or a workshop board.

Density is shop-counter practical rather than editorial: real photography of the cars, real prices set large in expanded italic numerals, fitment data in tabular figures. One typeface, Archivo variable, does all the work by moving along its width axis; expanded black italic uppercase is the livery lettering, normal width is the voice at the counter. The page is dark-locked; there is no light theme.

Motion is spent once. On load the hero headline accelerates from condensed to expanded while the stripe sweeps in; after that, state changes are short eases and the brand chips snap like decals. With reduced motion requested, all of it stops and the page arrives settled.

**Key Characteristics:**
- Dark-locked asphalt ground with pit-wall panels and bone type.
- Tiger orange as a committed field colour (spine, seam stripe, drenched deals band, footer rule), not a sprinkle.
- One family, Archivo variable, contrast carried by width, weight and italic.
- Controls are slanted decals (-12deg) with upright content; containers are square.
- Chassis plates as bone race-number boards.
- One signature motion; reduced motion fully respected.

## Colors

A near-monochrome warm-black and bone palette with one high-voltage orange that is used in fields, not flecks.

### Primary
- **Tiger Orange** (tiger): the livery. Fills the fixed spine, the hero stripe and pinstripe, primary decal buttons, selected brand chips, the deals band (drenched, with asphalt text), the B2B wedge, the footer top rule, focus outlines and text selection. Also the second line of the hero headline.
- **Hot Tiger** (tiger-hot): hover state of orange controls and orange link hover only. Never a resting fill.

### Neutral
- **Wet Asphalt** (asphalt): page ground, field and chip resting fill, ink buttons, and text on orange (as on-tiger).
- **Pit Wall** (pit): raised panels: finder, brands rail, category cards, feature body, advice card, B2B band, footer.
- **Pit Shadow** (pit-2): hairline dividers on the ground, hover fill of rails and ink buttons.
- **Gasket Line** (line): 1px borders on fields, chips, tags and the finder; timeline track; scrollbar thumb.
- **Bone** (bone): primary text; fill of chassis plates and decal codes.
- **Smoke** (smoke): secondary text, field labels, ledes, metadata, unselected tabs.
- **Primer Plate** (plate): the light product stage behind cut-out product photography.

### Named Rules
**The Committed Field Rule.** Orange is applied as surface (stripe, band, wedge, fill), not as thin tinting of neutral elements. When a section needs emphasis it goes fully orange with asphalt text; it does not get an orange border.

**The Dark Lock Rule.** Asphalt is the ground at every width. Light surfaces exist only as objects sitting on it: bone plates, decal codes and the primer product stage.

## Typography

**Display Font:** Archivo variable, self-hosted (wght 100-900, wdth 62-125, normal and italic), with Arial Narrow, system-ui fallback
**Body Font:** Archivo at normal width (100%)

**Character:** A single grotesque stretched into livery lettering. Expanded black italic uppercase reads as paint on a car; the same family at normal width reads as a person at the counter.

### Hierarchy
- **Display** (860 italic, uppercase, wdth 118%, clamp(2rem, 4.4vw, 3.75rem), line-height 0.98): section titles and the footer sign-off. The hero headline runs at wdth 108% and clamp(2rem, 4.6vw, 4.25rem), one line per span, second line in tiger orange.
- **Numeral** (900 italic, wdth 120-125%, line-height 0.95-1, tabular): chassis codes on plates, deal and product prices, the B2B wedge figure. Prices in the system are always set this way.
- **Headline** (900 italic, uppercase, wdth 118-120%, clamp(1.5rem, 2.4vw, 2.1rem), line-height 1-1.05): category names, card titles, timeline steps (850).
- **Title** (850 upright, wdth 108%, clamp(1.6rem, 2.6vw, 2.25rem), line-height 1.1, sentence case): product names and prose section heads where a full sentence must stay readable.
- **Body** (400, 1.0625rem desktop / 1rem mobile, line-height 1.6): copy at 42-62ch; ledes 1.125rem in smoke at 52ch.
- **Label, decal** (800 italic, uppercase, wdth 112%, 0.95rem, 0.01em): text inside buttons and chips.
- **Label, field** (700, 0.85rem, sentence case, smoke): form labels, legends, spec terms.

### Named Rules
**The Width Axis Rule.** Hierarchy is made by moving wdth, weight and italic within Archivo, never by adding a second family. Expanded italic uppercase is for livery moments (display, numerals, decals); anything a visitor must read in sentences stays upright at normal width.

**The Tabular Fitment Rule.** Prices, chassis years, counts and hours use tabular figures.

## Layout

A centered 1360px column with a fluid gutter (clamp(16px, 4vw, 56px)). Sections breathe at clamp(80px, 11vw, 150px) vertical padding; drenched or banded sections (deals, B2B) carry their own padding and run full-bleed. Grids are asymmetric (1.25fr / 1fr, 1.4fr / 1fr / 1fr) rather than evenly divided; deal cards are staggered with the side card dropped up to 140px.

The spine is fixed at the left edge of the content column (6px, 4px under 1100px) at every width, under the header and above content. Breakpoints step at 1180px (chassis grid to 3 columns), 1023px (nav collapses to the menu button; two-column layouts stack), and 767px (single column, hero photo becomes a 190px band above the headline and finder, chassis plates turn into horizontal rows). Controls hold a 52px height (48px on mobile fields).

## Elevation & Depth

Depth is mostly tonal: asphalt ground, pit panels above it, pit-2 hairlines between. Shadows are soft, long and dark, used to lift objects off the ground rather than to style surfaces, and every shadow is diffuse.

### Shadow Vocabulary
- **Finder lift** (`box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.8)`): the docked finder over the hero photo, with a 10px backdrop blur.
- **Deal art drop** (`box-shadow: 0 30px 50px -28px rgb(9 7 6 / 0.7)`): promo artwork on the orange band.
- **Plate drop** (`0 18px 30px -18px rgb(0 0 0 / 0.8)`, combined with the plate's inset frame): chassis plates.
- **Decal glow** (`box-shadow: 0 10px 24px -10px rgb(231 95 0 / 0.65)`): hover on orange buttons only.
- **Product drop** (`filter: drop-shadow(0 26px 22px rgb(9 7 6 / 0.35))`): cut-out product on the primer stage.

### Named Rules
**The Lift Not Line Rule.** Shadows are diffuse and negative-spread so they read as an object sitting off the ground. No hard offset shadows.

**The Glass Header Rule.** The sticky header is the one translucent surface: asphalt at 86% with blur(14px) saturate(140%), falling back to solid asphalt.

## Shapes

Two geometries only. Containers are square (0 radius everywhere: panels, fields, cards, tags, images). Interactive controls are parallelograms skewed at -12deg with their content counter-skewed upright; the same slant is reused for nav underlines, the selected tab bar, timeline markers and the B2B wedge. Chassis plates use a gentler -8deg. Diagonal stripes appear as livery: the hero stripe at skewY(-1.6deg), a rotated band on the product stage, and a -58deg hatch fading in across the deals band.

**The Decal Rule.** If you can press it, it is slanted at -12deg and its label stays upright. If it only holds content, it is square.

## Components

### Buttons
Decals cut from vinyl: hard, slanted, loud.
- **Shape:** parallelogram, skewX(-12deg), square corners, content counter-skewed.
- **Primary:** tiger fill, asphalt label, 52px tall, 0 26px padding (0 18px on mobile), decal label type, optional 1.25em icon with 10px gap.
- **Hover / Focus:** fill shifts to tiger-hot with the decal glow; active presses 1px down at 0.98 scale; focus is a 3px orange outline at 3px offset (asphalt on orange bands).
- **Ink:** asphalt fill, bone label, for use on the orange deals band; hover to pit-2.
- **Text link:** bone, 700, underline 2px in tiger; hover turns tiger-hot.

### Chips
- **Style:** brand chips are small decals: asphalt fill, 1px line border, 42px tall (38px mobile), decal label with the brand mark (masked SVG in currentColor).
- **State:** hover lifts the border to smoke; selected fills tiger with asphalt text and plays a 0.32s decal snap (scale 0.94 to 1.04 to 1). Focus is a 3px bone outline.
- **Tags:** square category tags in translucent asphalt with a line border; hover fills tiger.

### Cards / Containers
- **Corner Style:** square (0).
- **Background:** pit on asphalt; category cards are full-bleed photographs under an asphalt bottom-up scrim with the name in headline type.
- **Shadow Strategy:** tonal by default; see Elevation for the few lifted objects.
- **Border:** 1px line around the finder; pit-2 hairlines between rail cells and sections.
- **Internal Padding:** 20px (finder), 26px (category), clamp(24px, 3vw, 40px) to clamp(28px, 4vw, 56px) for feature and advice bodies.

### Inputs / Fields
- **Style:** asphalt fill, 1px line border, square, 52px tall, 0 14px padding, 600 weight at 1rem. Selects carry a small tiger chevron drawn in CSS.
- **Focus:** border turns tiger plus a 2px tiger ring; hover lifts the border to smoke.
- **Error / Disabled:** error text and border in a light orange (#ff9a57), 700 weight; disabled selects drop to smoke at 0.8 opacity.

### Navigation
- **Style:** tiger topbar strip (38px) with the shipping promise in expanded italic uppercase; below it a sticky glass header, 76px (64px mobile), logo left, upright 700 nav links at wdth 108%.
- **Hover:** a 3px tiger bar, skewed at the decal slant, wipes in under the link from the left.
- **Mobile:** links collapse into a menu button; the drawer lists links in expanded italic uppercase at 1.25rem divided by pit-2 hairlines.

### Chassis Plate (signature)
Bone race-number boards. Skewed -8deg with upright content, a 6px bone margin and 3px inset asphalt frame drawn with inset shadows, an orange 10px bar along the foot, and the chassis code in the numeral style. Hover turns the board tiger with an asphalt foot bar and lifts it 4px.

### Livery Spine and Seam Stripe (signature)
A fixed 6px tiger stripe at the left of the content column with a 2px bone core that fills with scroll progress (scroll-driven animation where supported). At the hero/rail seam a 14px stripe and 3px pinstripe cut across the full width at a shallow angle.

### Signature Motion
Hero headline lines accelerate in over 1.1s: wdth 62% to 108%, sliding from -48px with a reverse skew and a blur that clears; the second line trails by 0.12s. The seam stripe and pinstripe sweep in by clip-path. Everything uses the out-expo ease (cubic-bezier(0.16, 1, 0.3, 1)). All of it, plus smooth scroll and the spine fill, is gated on prefers-reduced-motion: no-preference.

## Do's and Don'ts

### Do:
- **Do** keep asphalt as the ground at every width and lift panels with pit, not with lighter greys.
- **Do** apply tiger orange as a field (stripe, band, wedge, fill) and put asphalt text on it.
- **Do** skew every pressable control at -12deg and counter-skew its content upright.
- **Do** keep every container square-cornered (0 radius).
- **Do** set prices and chassis codes in 900 italic expanded Archivo with tabular figures.
- **Do** carry the spine at the left of the content column through every section.
- **Do** gate any motion beyond short state eases behind prefers-reduced-motion.

### Don't:
- **Don't** introduce a second typeface; reach for Archivo's width axis instead.
- **Don't** round corners on panels, fields, cards, tags or images.
- **Don't** use hard offset shadows; lifts are diffuse and negative-spread.
- **Don't** spend a second signature animation; the hero acceleration is the only load choreography.
- **Don't** set long reading copy in expanded italic uppercase.
- **Don't** add a light theme or a white page section.
