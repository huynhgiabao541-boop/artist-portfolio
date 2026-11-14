---
name: Gallery Minimal
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#9d4225'
  on-secondary: '#ffffff'
  secondary-container: '#fd8c68'
  on-secondary-container: '#742508'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f1f15'
  on-tertiary-container: '#76887a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#7e2c10'
  tertiary-fixed: '#d4e7d6'
  tertiary-fixed-dim: '#b8cbbb'
  on-tertiary-fixed: '#0f1f15'
  on-tertiary-fixed-variant: '#3a4b3e'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Newsreader
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.5rem
  margin-desktop: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system establishes an intimate, museum-grade portfolio experience tailored for an independent artist and illustrator. It evokes the quiet focus of a white-cube contemporary gallery, paired with the tactile warmth of archival rag paper and catalog raisonné publishing. 

The aesthetic is grounded in **Editorial Minimalism**:
- Generous breathing space framing original artwork without chromatic competition.
- Deliberate typographic hierarchy balancing high-contrast classical serifs with utilitarian sans-serif captions.
- Tactile framing inspired by archival mounting boards, delicate hairline rules, and matte print textures.
- The interface acts as a silent curator: purposeful, restrained, and serving entirely to elevate the artwork on display.

## Colors

The palette reproduces the tactile quality of a fine art monograph:

- **Primary (`#1A1A1A`)**: Deep lithographic carbon ink. Applied to primary editorial titles, high-priority interactive states, and definitive framing lines.
- **Secondary (`#C25E3E`)**: Muted terracotta. Used sparingly for interactive accents, availability statuses (e.g., original work acquired vs. available), and focus states.
- **Tertiary (`#4A5B4E`)**: Archival sage. Applied to contextual metadata, secondary tags, and collection indicators.
- **Neutral (`#FAF8F5`)**: Warm natural rag paper. Serves as the primary canvas ground, supplemented by tonal container steps (`#F5F2EB` for exhibition cards and recessed canvas panels; `#EAE5DB` for subtle border structures).

Color must never distract from the visual work. Accent colors should be applied with surgical restraint, functioning as navigational cues rather than decorative fills.

## Typography

The typographic hierarchy juxtaposes literary serif styles with modern architectural sans-serif notation:

- **Headings (Playfair Display)**: Display titles, exhibition titles, and artwork series names. Handled with editorial pacing and optical kerning to reflect classic art catalog publication.
- **Narrative & Body (Newsreader)**: Artist statements, project narratives, and editorial commentary. Selected for high legibility, organic cadence, and warm traditional rhythm.
- **Metadata & Labels (Hanken Grotesk)**: Artwork dimensions, medium, year, pricing, and system controls. Rendered in clean, tracking-spaced uppercase or small-caps styling to replicate museum specimen cards.

## Layout & Spacing

The layout model is governed by an asymmetrical fluid grid inspired by editorial print compositions:

- **Grid Architecture**: 12-column variable grid on desktop systems; 4-column layout on mobile devices.
- **Artwork Framing**: Art pieces span deliberate column units (e.g., full 8-column wide focal displays paired with offset 4-column descriptive margins) rather than rigid, identical tiles.
- **Whitespace Discipline**: Ample margins (`margin-desktop`) ensure visual air around artworks, preventing visual noise. Negative space is treated as an active framing element.
- **Responsive Transitions**: Multi-column editorial groupings collapse linearly on mobile viewports while preserving proportional artwork aspect ratios and generous top/bottom separations.

## Elevation & Depth

To maintain an authentic gallery atmosphere, this system rejects heavy drop shadows and high-gloss lighting effects in favor of flat, tactile surface layering:

- **Plinth & Canvas Tiers**: Spatial hierarchy is achieved through tone-on-tone surface shifts. Base backgrounds use `#FAF8F5`, while active cards, image pedestals, and lightboxes use `#F5F2EB`.
- **Archival Hairlines**: Visual separation uses 1px solid borders (`#EAE5DB`) resembling matte presentation board seams.
- **Floating Work Hover**: Hovering over artwork cards induces a delicate lift created by a whisper-soft diffused aura (`0 8px 24px -4px rgba(26, 26, 26, 0.05)`), simulating natural directional gallery lighting on paper.
- **Overlays & Modals**: Full-screen viewports for artwork inspection use a semi-translucent backdrop (`#FAF8F5` at 96% opacity) with a subtle backdrop blur (4px) to retain spatial awareness without visual clashing.

## Shapes

The design system employs **sharp, crisp geometry (`0`)** across containers, artwork bounding boxes, interactive buttons, and imagery. 

- Sharp 90-degree corners mimic picture frames, trimmed archival paper, and exhibition catalog margins.
- Avoid all rounded corners on image containers, cards, and modal dialogs.
- Micro-elements such as badge indicators or status pills may utilize hairline borders but must remain strictly rectilinear.

## Components

### Buttons
- **Primary**: Solid carbon black background (`#1A1A1A`), off-white typography (`#FAF8F5`), zero corner radius. Text styled with `label-sm` uppercase. Subtle hover shift to muted terracotta (`#C25E3E`).
- **Secondary / Ghost**: Transparent fill, 1px border in `#1A1A1A`, text in `#1A1A1A`. Hover transitions fill to `#F5F2EB` without layout shift.
- **Text Action**: Raw typographic links styled in `label-sm` with a permanent 1px underline positioned 3px below the baseline.

### Exhibition & Museum Cards
- **Structure**: Sharp rectangular containers with a `#F5F2EB` surface tone and optional 1px hairline border (`#EAE5DB`).
- **Artwork Display**: Image renders flush to the top and side edges or inset by `space-md` with an archival matte frame margin.
- **Caption Block**: Positioned below the visual. Displays artwork title (`headline-md`), year, medium, and dimensions rendered cleanly in `label-md` sans-serif.

### Chips & Metadata Badges
- **Appearance**: Rectangular tags with 1px border in `#EAE5DB`, no background fill.
- **Typography**: `label-sm` in carbon ink (`#1A1A1A`) or muted tertiary sage (`#4A5B4E`). Used for taxonomy: medium (e.g., "GOUACHE ON COTTON RAG"), edition details ("1/1 ORIGINAL"), or availability.

### Form Inputs & Text Fields
- **Fields**: Minimalist underline-only or 1px bordered boxes on `#FAF8F5`.
- **Placeholder & Value**: Values set in `body-md` Newsreader serif; floating labels set in `label-sm` Hanken Grotesk uppercase. Focus state tightens the border to 1px `#1A1A1A`.

### Artwork Zoom & Lightbox
- **Modal**: Dedicated full-bleed contemplation space. Minimal header with title, technical spec sheet, and close trigger formatted as a hairline cross icon.
- **Controls**: Magnification and scale toggle controls anchored quietly in the bottom right using crisp rectilinear ghost panels.