# SAATHI-AI Design System Specification

> **MANDATORY NOTICE**: This design system is authoritative and strictly enforced across all user interfaces in SAATHI-AI. Do not deviate from these tokens, colors, or structural rules. Do not fall back to default Tailwind, Material, or Bootstrap styling in any phase.

---

## 1. Color Palette

Every color in SAATHI-AI is tied to an exact hexadecimal token. Never use default saturated Tailwind blues, reds, or greens.

| Role | Name | Hex Code | Light Tint Hex | Usage Description |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas** | Background | `#FFFFFF` | — | Main window & screen background |
| **Card Surface** | Surface | `#FFFFFF` | — | Content container with 1px border `#E8EAEE` |
| **Border / Divider** | Border Subtle | `#E8EAEE` | — | Structural 1px separation lines (no box-shadows) |
| **Typography** | Text Primary | `#1F2430` | — | Headings, high-contrast labels, primary copy |
| **Typography** | Text Secondary | `#66707A` | — | Descriptions, metadata, secondary copy |
| **Typography** | Text Muted | `#8A8F98` | — | Timestamps, placeholder labels, disabled state |
| **Accent / AI** | Teal Accent | `#0E7C7B` | `#F1FBFA` | Primary AI cues, active highlights, key links |
| **Critical / High** | Danger Red | `#B23A3A` | `#FCEEEE` | High distress alerts, severe delay risk, critical tags |
| **Medium / Warn** | Amber Orange | `#A6650F` | `#FBF1E1` | Medium urgency, caution signals, pending approvals |
| **Low / Success** | Forest Green | `#2F855A` | `#E9F7EF` | Resolved cases, normal status, low distress score |
| **Primary Action** | Dark Button | `#1F2430` | — | Single primary action button (near-black, max 1/screen) |

---

## 2. Typography

- **Font Family**: Clean system sans-serif stack:
  ```css
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ```
- **Headings**:
  - `font-weight: 600` (SemiBold) or `font-weight: 700` (Bold)
  - Color: `#1F2430`
  - Never use ALL-CAPS for headings.
- **Body Text**:
  - `font-size: 13px` to `14.5px`
  - `font-weight: 400` (Regular)
  - `line-height: 1.6` to `1.75`
  - Color: `#1F2430` or `#66707A`
- **Eyebrow / Small Meta Labels**:
  - `font-size: 11px` to `12px`
  - `font-weight: 600`
  - `letter-spacing: 0.4px`
  - Uppercase allowed only for small eyebrow labels.
  - Color: `#8A8F98` or `#66707A`

---

## 3. Component Architecture & Rules

### Containers & Cards
- **Border Radius**: `16px` (`rounded-2xl`).
- **Surface**: Solid `#FFFFFF`.
- **Border**: Strictly `1px solid #E8EAEE`.
- **Depth**: **Never use box-shadow for depth.** All depth and hierarchy must be achieved through 1px `#E8EAEE` borders and subtle surface contrast.

### Buttons & Interactive Controls
- **Border Radius**: `10px` – `12px` (`rounded-xl`).
- **Primary Solid Button**: `#1F2430` background, `#FFFFFF` text. **Maximum ONE solid dark button per screen/view.**
- **Secondary / Ghost Buttons**:
  - Outlined with `1px solid #E8EAEE`, `#1F2430` text, transparent or subtle `#F8F9FA` hover.
  - Accent ghost with `1px solid #0E7C7B`, text `#0E7C7B`, background `#F1FBFA`.
- **No Gradients**: Never apply CSS linear/radial gradients to buttons, cards, or backgrounds.

### Badges & Status Pills
- **Border Radius**: `20px` (full pill `rounded-full`).
- **Padding**: `4px 10px`.
- **Styling**: Light tint background with matching deep tone text:
  - Critical: Background `#FCEEEE`, Text `#B23A3A`, Border `1px solid #F8D7D7`
  - Warning: Background `#FBF1E1`, Text `#A6650F`, Border `1px solid #F5E2C4`
  - Success: Background `#E9F7EF`, Text `#2F855A`, Border `1px solid #C7EBD7`
  - Accent: Background `#F1FBFA`, Text `#0E7C7B`, Border `1px solid #D0F2EE`

### Iconography
- **Icon Set**: **Lucide React line icons only**.
- **Stroke Width**: `1.75px` or `2px` standard.
- **Rule**: Never mix icon styles (no filled emojis, no 3D icons, no sketchy glyphs).
- **Rule**: Never place icons inside pastel-colored circle backgrounds as decorative filler.

### Sample Data Standards
- Never use *Lorem Ipsum*, `John Doe`, or `Test User 1`.
- Use realistic Indian context:
  - Caller/Operator: *Ananya Sharma*, *Rajesh Patel*, *Pooja Verma*, *Vikram Singh*
  - Districts/Locations: *Gorakhpur*, *Varanasi*, *Indore*, *Pune*, *Jaipur*, *Patna*
  - Realistic operational timestamps (e.g., *10:42 AM IST, 24 Oct*).

---

## 4. Signature Visual Element: SVI Radial Arc Gauge

The **Stress Vulnerability Index (SVI)** is a core metric calculated on a scale of `0–100`.

- **Visual Form**: Must **ALWAYS** be visualized as a **semi-circle radial arc gauge** (SVG arc with a colored progress path), never as a plain linear horizontal bar.
- **Color Thresholds**:
  - `0 – 35` (Low): `#2F855A` (Forest Green)
  - `36 – 70` (Medium): `#A6650F` (Amber Orange)
  - `71 – 100` (Critical): `#B23A3A` (Danger Red)
- **Display**: The central number shows the integer score (e.g., `78`), with a subtle label `SVI / 100` and qualitative label (`Critical Urgency`).

---

## 5. Explicit Anti-Patterns (What to Avoid)

To maintain a professional, high-trust emergency-response software aesthetic, the following generic web template patterns are **strictly prohibited**:
1. ❌ **No Centered Hero Blobs**: No marketing-style centered hero sections with colorful blurred gradient blobs.
2. ❌ **No Pastel Icon Circles**: Do not wrap icons in oversized pastel circle badges just for decorative padding.
3. ❌ **No Undifferentiated Stat Cards**: Do not render endless identical rounded boxes without clear information hierarchy.
4. ❌ **No Generic Landing Pages**: The UI is an operator workstation and decision cockpit, not a SaaS landing page.
5. ❌ **No Dark Mode by Default**: Do not render dark backgrounds unless explicitly requested. Default is clean `#FFFFFF` with `#E8EAEE` borders.
