---
name: Gupt Sabha
description: Three illustrated worlds for a secret council of hidden loyalties
colors:
  metal: "#cfb375"
  metal-hi: "#f7e3af"
  metal-low: "#73552c"
  paper: "#171917"
  panel: "#22251f"
  raised: "#2b2e27"
  ink: "#eee7d9"
  muted: "#bab6a8"
  accent: "#ddc49a"
  on-accent: "#211e19"
  line: "#42453c"
  green: "#b4d397"
  red: "#f0a090"
  rang-paper: "#17152a"
  rang-panel: "#25213d"
  rang-raised: "#322d4e"
  rang-ink: "#f6ecff"
  rang-muted: "#c1b5d4"
  rang-accent: "#e6b4ff"
  rang-on-accent: "#29163b"
  rang-line: "#4c405e"
  rang-green: "#aeddac"
  rang-red: "#ffaca4"
  vana-paper: "#102923"
  vana-panel: "#193a30"
  vana-raised: "#254a3c"
  vana-ink: "#edf4dd"
  vana-muted: "#b5c8b7"
  vana-accent: "#badd81"
  vana-on-accent: "#182c1b"
  vana-line: "#3e5a4a"
  vana-green: "#badd81"
  vana-red: "#f2b5a0"
  support: "#ceddb4"
  on-support: "#21351e"
  sabotage: "#d99789"
  on-sabotage: "#3f201d"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(38px,4.5vw,68px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-.035em"
  body:
    fontFamily: "DM Sans, sans-serif"
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  control: "10px"
  option: "8px"
  marker: "10px"
  card: "12px"
  panel: "14px"
  pill: "24px"
spacing:
  small: "12px"
  medium: "18px"
  panel: "24px"
  large: "30px"
components:
  button-primary:
    backgroundColor: "{colors.metal}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "15px 25px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "15px 25px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "10px 0"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px"
  team-chip:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
---

# Design System: Gupt Sabha

## Overview

**Creative North Star: "Three Worlds, One Secret Council"**

An illustrated moonlit Indian council chamber frames three illustrated worlds: Katha’s black and bone silhouettes, Rang’s saturated pop portraits, and Vana’s teal forest action and luminous spirit contours. A three-card fan, compact room menu, grotesque titles, and tactile controls give the council its character.

Theme selection changes the entire surface palette and deck artwork while preserving the rules and decision hierarchy. Clear shared actions and deliberately concealed identity support experienced players and first-time friends at the same table.

**Key Characteristics:**

- Three distinct illustrated decks within a moonlit council chamber.
- Bricolage Grotesque titles and DM Sans instructions, served locally.
- Recessed game surfaces, beveled metal controls, and reflective foil cards.
- Explicit role reveal and a mobile private-card drawer.


## Colors

The palette follows the selected deck. Frontmatter captures the actual custom properties from `src/style.css`; unprefixed tokens describe Katha, while `rang-` and `vana-` record complete overrides. Historical room IDs remain `mural`, `festival`, and `ink` respectively.

### Primary

Theme accents mark selection and focus. Primary controls use a metallic highlight-to-shadow ramp: warm brass in Katha, copper-gold in Rang, and green-gold in Vana, with dark text. `src/tabletop.css` is the material override after the base stylesheet.

### Secondary

Theme-specific `green` and `red` tokens mark readiness, success, and failure. Support and Sabotage decision cards use their dedicated pale green and terracotta pairs across all themes. Words and icons accompany these colors.

### Neutral

`paper` is the dark page canvas despite its legacy name. `panel` and `raised` form progressively lighter surfaces. `ink` is the light reading color; `muted` supports descriptions and metadata; `line` defines dividers and outlines. Rang moves these neutrals into purple, Vana into deep green.

**The Whole World Rule.** Change the deck and its complete surface palette together; retain the same decision hierarchy.

## Typography

Bricolage Grotesque with sans-serif fallback carries headings, world names, the wordmark, and role names. DM Sans with sans-serif fallback carries instructions, labels, controls, and status. Both are locally served through `src/fonts.css`; Bricolage weights 400–800 and DM Sans weights 400–700 are included.

Frontmatter records base roles. The home headline uses `clamp(38px,4.1vw,56px)`, becoming 38px on mobile and 34px below 370px. World names use 60px desktop and 51px mobile. Bricolage also carries embossed headline shadows. Instructions retain DM Sans and mobile inputs remain 16px.

## Layout

The main container caps at 1384px with 32px side padding; the header and footer align to a 1320px content area. Mobile uses 20px side padding, or 15px below 370px. `src/chamber.css` owns the final spatial overrides after the base and material stylesheets.

Desktop home divides into a room menu and a large fan of three illustrated cards. Create and join actions sit beside the art, followed by beginner help. Three compact deck selectors show the real common backs. Mobile places actions before the card fan and keeps all three theme choices visible. Card size and rotation reduce on phones to fit without clipping the page. Expanded preview shows four labeled cards below the main menu.

The original background painting is fixed behind the interface and dims during play. Architecture stays at the periphery; nearly opaque shared-action panels protect readability. The lobby table uses the same environment as its physical setting.

Lobby uses a 1.5fr / 1fr board/settings grid with 5% gap; gameplay uses 1.6fr / 1fr and 28px gap. At 1100px these become 1.3fr / 1fr with 25px gap and 1.4fr / 1fr with 22px gap. Mobile stacks shared decisions and exposes private identity through a fixed shortcut. Initial role reveal brings the private panel before the play area; subsequent phases use a user-opened drawer. The five-column seating grid becomes three columns. The expedition track remains horizontal.

## Elevation & Depth

Pressed metal controls use top-edge highlights, an extrusion base, and a soft contact shadow. Pressing lowers the control four pixels into its base. Recessed panels use restrained inset shadows; expedition markers resemble metal tokens. The user explicitly requested skeuomorphic material, so dimensional edges and metallic frames are intentional.

Cards use pointer-positioned specular light and a rainbow diffraction band over artwork. Pointer tilt is limited to a few degrees; touch and role reveal trigger a single brief foil pass. Captions remain above the reflective layer. Reduced motion removes tilt and shine animation, retaining a quiet static finish. No perpetual animation runs.

Short locally synthesized cues distinguish button presses, deck selection, card handling, and phase changes. Audio starts only after interaction. A labeled header toggle persists mute, and background documents are silent. Cues never vary by private role or allegiance.

## Shapes

Buttons use ten-pixel corners and fields six; options and player rows use eight; expedition markers are circular; artwork and cards use twelve; larger forms, play surfaces, and dialogs use fourteen. The council board has an arched top (140px desktop, 85px mobile), circular seats, and dashed empty-seat borders. Team names are pills. Artwork uses a 3×3 atlas for each theme, with dedicated male Merlin portraits overriding slot zero. Merlin uses the full standalone portrait; all other roles and the common back retain atlas crops.

## Components

- **Actions:** beveled metal primary controls, dark raised secondary controls, and quiet text actions. Both raised variants depress on press and retain visible keyboard focus. Disabled controls are recessed and desaturated.
- **Sound control:** always available in the header, with a speaker icon and explicit enable/mute accessible name; mute persists locally. Sound carries no information unavailable visually.
- **Icons:** authored eye, crown, card stack, scroll, sword, and seal symbols carry game actions. Lucide remains for conventional utilities.
- **Fields:** persistent labels, dark canvas fill, line border, and 16px padding. Room codes use uppercase with 6px letter spacing, becoming 24px text on mobile.
- **World selection:** three compact buttons combine actual card backs, theme names, and selected state. Selection changes the three-card fan and palette. The fan is decorative; the accessible buttons and explicit deck preview provide the information. Settings retain compact art/radio rows.
- **Council and team:** circular initial avatars, wrapping player names, host/leader indications, labeled readiness, and dashed vacancies. Chosen team rows use an accent outline and raised fill. Team chips summarize names without implying an action.
- **Private card:** a 218×318px desktop card rotates to reveal mounted role content. Mobile uses 229×330px, or 210×300px in the drawer. The common back reveals no allegiance. Role text sits on an opaque caption surface. Explicit reveal/hide, phase changes, disconnect, and document hiding conceal identity.
- **Mobile private drawer:** fixed shortcut at bottom 19px; drawer inset 85px 12px 80px above a scrim. It supports Escape, focus containment/restoration, and explicit closure. Opening it does not automatically reveal the card.
- **Phase guide and results:** numbered stages, turn guidance, five expedition markers, and a two-sided public score show progress. Each side counts expedition outcomes toward three; it does not replace the final winner announcement. The expedition leader receives a metal avatar and outline. Public announcements never include private knowledge.
- **Rules:** a scrollable 620px modal with close control, keyboard containment/restoration, and expandable rules sections.

Current shipping artwork is `public/art/katha.png`, `public/art/rang.png`, `public/art/vana.png`, and the original `public/art/council-chamber.png` environment. Game inspirations and application decisions are recorded in `docs/redesign/GAME-INSPIRATION.md`. `src/themes.js` and `src/main.jsx` define atlas selection and ordering. Reference intent is recorded in `docs/redesign/RESEARCH.md`; rendered review evidence is in `.impeccable/review/`. The panel snippets below illustrate actual controls and caption surfaces; they do not substitute for these atlas images.

## Do's and Don'ts

### Do:

- Do reskin canvas, panels, text, borders, and feedback together when changing themes.
- Do preserve visible keyboard focus, reduced-motion states, and labels alongside status colors.
- Do keep role artwork and knowledge concealed until explicit reveal.
- Do use the current three atlases and preserve their recorded provenance.

### Don't:

- Don't reintroduce the superseded cream canvas, Caslon headings, or old theme names.
- Don't change mechanics or public information hierarchy between themes.
- Don't encode allegiance in card backs or public announcements.
- Don't substitute decorative portrait art for readable rules or action labels.

## Council controls and readable play (September 2026)

`src/council-ui.css` owns the final interaction styling after the chamber layer. Primary actions are pressed brass plates with 4px corners and a fine inset frame; secondary actions use dark metal with pale metal text. Menu actions stack a 19px action name above a 12px explanation. Shared actions have a 52px minimum height; utilities and selection controls have a 44px minimum target. Body instructions use 15px, supporting copy 13px, compact metadata 12px, utilities 14px, and decision labels 18px. Home titles span 40–64px on desktop and 36–48px on phones. The inset border radius is 1px. Warm dark control ink (#241d12), pale focus rings (#fff0b9), and light environment text (#e0dfd2 / #d0d0c3) complement the existing metal palette. Translucent warm highlights and dark contact shadows express the established materials.

Buttons name actions directly. Host and join each have one menu entry, readiness blockers identify the next step, role confirmation requires a reveal, and expedition choices remain editable until explicitly sealed. Selecting a theme never submits the room form. Team selection uses the whole player row as a target and explains the capacity limit.

Route and phase transitions focus the main heading. Dialogs isolate the surrounding interface with inert, contain keyboard focus, lock background scrolling, and restore focus after closing. Private identity is concealed when opening header help; private cards still conceal on phase changes and document hiding. A skip link, visible focus rings, forced-color selected states, and reduced-motion behavior support alternative input and viewing settings.

## Revised deck artwork — September 2026

The user requested more visual distance from the original references. Active assets are now public/art/katha-v2.png, public/art/rang-v2.png, and public/art/vana-v2.png. Katha uses engraved charcoal and bone with copper details and stepped architecture; Rang uses warm screen-print textures and asymmetrical architectural colour fields; Vana uses layered moonlit forest painting with silver botanical borders. Poses, costumes, and common backs were revised. The backs use a compass seal, ribbon knot, and mirrored banyan trees respectively, replacing the eye motifs.

All roles, including adult male Merlin, now come from the same 3×3 atlas. The standalone Merlin overrides are no longer consumed. Original files remain available for rollback. Role order, theme IDs, game mechanics, and public/private information remain unchanged. Built-in imagegen prompts are saved in docs/redesign/theme-v2/PROMPTS.md. This section supersedes earlier art descriptions.
