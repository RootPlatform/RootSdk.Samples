# Root Design System

Design tokens and patterns for building UIs that match the Root visual style.

## Important: Theme-Aware Colors

Root uses CSS custom properties (variables) prefixed with `--rootsdk-` for colors.
**The Root hosting environment automatically sets these variables** based on the user's
theme preference (light/dark). Your app does not need to know the actual color values -
just reference the CSS variables and they will adapt automatically.

---

## Colors

### How to Use Colors

Reference colors using CSS variables:

```css
.my-element {
  background-color: var(--rootsdk-background-secondary);
  color: var(--rootsdk-text-primary);
  border: 1px solid var(--rootsdk-border);
}
```

### Color Reference

#### Brand Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| brandPrimary | `--rootsdk-brand-primary` | Primary brand color, used for primary buttons and key interactive elements |
| brandSecondary | `--rootsdk-brand-secondary` | Secondary brand color, used for success states and accents |
| brandTertiary | `--rootsdk-brand-tertiary` | Tertiary brand color, used for additional accents |

#### Text Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| textPrimary | `--rootsdk-text-primary` | Primary text color for headings and body text |
| textSecondary | `--rootsdk-text-secondary` | Secondary text color for less prominent text |
| textTertiary | `--rootsdk-text-tertiary` | Tertiary text color for disabled or placeholder text |
| textWhite | `--rootsdk-text-white` | White text color, used on dark backgrounds regardless of theme |

#### Background Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| backgroundPrimary | `--rootsdk-background-primary` | Primary background color for main content areas |
| backgroundSecondary | `--rootsdk-background-secondary` | Secondary background color for cards and panels |
| backgroundTertiary | `--rootsdk-background-tertiary` | Tertiary background color for nested elements and dropdowns |

#### Surface Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| surfacePrimary | `--rootsdk-surface-primary` | Primary surface color for elevated elements like modals |
| surfaceSecondary | `--rootsdk-surface-secondary` | Secondary surface color for nested elevated elements |
| surfaceTertiary | `--rootsdk-surface-tertiary` | Tertiary surface color for deeply nested elements |

#### Interactive Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| input | `--rootsdk-input` | Background color for input fields |
| border | `--rootsdk-border` | Border color for dividers and element boundaries |
| link | `--rootsdk-link` | Color for links and clickable text |
| muted | `--rootsdk-muted` | Muted color for disabled states and subtle elements |
| highlightLight | `--rootsdk-highlight-light` | Light highlight for subtle hover states |
| highlightNormal | `--rootsdk-highlight-normal` | Normal highlight for standard hover states |
| highlightStrong | `--rootsdk-highlight-strong` | Strong highlight for active/pressed states |

#### Status Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| info | `--rootsdk-info` | Info/notice color for informational messages |
| warning | `--rootsdk-warning` | Warning color for caution states |
| error | `--rootsdk-error` | Error color for error states and destructive actions |

#### Mention Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| selfMention | `--rootsdk-self-mention` | Background color when the current user is mentioned |
| communityMention | `--rootsdk-community-mention` | Background color for @everyone or community mentions |
| channelMention | `--rootsdk-channel-mention` | Background color for channel mentions |

#### Special Colors

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| backgroundBlur | `--rootsdk-background-blur` | Semi-transparent background for blur/overlay effects |

---

## Spacing

Use consistent spacing values for padding and margins.

| Name | Value | Description |
|------|-------|-------------|
| none | `0` | No spacing |
| xs | `4px` | Extra small spacing for tight layouts (gap between small icons) |
| sm | `8px` | Small spacing for compact elements (inner padding) |
| md | `12px` | Medium spacing for standard layouts (gap between elements) |
| lg | `16px` | Large spacing for comfortable layouts (panel padding) |
| xl | `20px` | Extra large spacing for section breaks (modal padding) |
| 2xl | `24px` | Double extra large spacing (major section gaps) |
| 3xl | `32px` | Triple extra large spacing |
| 4xl | `48px` | Major section spacing |

---

## Border Radius

Root uses rounded corners extensively. The most common radius is `12px` (rounded-xl).

| Name | Value | Tailwind | Use Case |
|------|-------|----------|----------|
| none | `0` | `rounded-none` | No border radius (sharp corners) |
| sm | `6px` | `rounded-md` | Small radius for icon buttons, close buttons |
| md | `8px` | `rounded-lg` | Medium radius for list items, dropdown options |
| lg | `12px` | `rounded-xl` | Large radius for inputs, panels, cards (most common) |
| xl | `16px` | `rounded-2xl` | Extra large radius for prominent containers |
| full | `9999px` | `rounded-full` | Fully rounded for pills, buttons, avatars, switches |

---

## Border Width

| Name | Value | Description |
|------|-------|-------------|
| none | `0` | No border |
| default | `1px` | Standard border width for inputs, cards, dividers |
| thick | `2px` | Emphasized borders for focus states |

---

## Shadows

Use shadows for modals, dropdowns, and popovers.

| Name | Value | Description |
|------|-------|-------------|
| none | `none` | No shadow |
| sm | `0 2px 4px rgba(0, 0, 0, 0.1)` | Subtle shadow for slight elevation |
| md | `0 4px 8px rgba(0, 0, 0, 0.15)` | Medium shadow for cards |
| lg | `0 0 12px rgba(0, 0, 0, 0.5)` | Large shadow for modals, dropdowns, popovers |

---

## Typography

### Font Family

- **Sans:** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Mono:** `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`

### Font Sizes

| Name | Size | Line Height | Description |
|------|------|-------------|-------------|
| xs | `12px` | `16px` | Extra small text for captions, badges |
| sm | `13px` | `20px` | Small text for status indicators |
| base | `14px` | `20px` | Base text size for body content, buttons |
| lg | `16px` | `24px` | Large text for input placeholders |
| xl | `20px` | `32px` | Extra large for modal titles |
| 2xl | `24px` | `32px` | Major headings |

### Font Weights

| Name | Value | Description |
|------|-------|-------------|
| normal | `400` | Normal weight for body text, placeholders |
| medium | `450` | Medium weight for modal titles, status text |
| semibold | `500` | Semibold for buttons, panel text |
| bold | `600` | Bold for strong emphasis |

---

## Transitions

| Name | Duration | Description |
|------|----------|-------------|
| fast | `150ms` | Fast transitions for switches, micro-interactions |
| normal | `200ms` | Standard transition speed for hover states |
| slow | `300ms` | Slower transitions for larger elements |

---

## Component Patterns

Common component styles extracted from Root first-party apps.

### panel

Standard panel/card container with rounded corners

**CSS:**
```css
.panel {
  background-color: var(--rootsdk-background-secondary);
  border-radius: 12px;
  padding: 16px;
  min-height: 80px;
}

.panel-bordered {
  border: 1px solid var(--rootsdk-border);
}
```

**Tailwind:**
```
// Panel: bg-background-secondary rounded-xl py-4 min-h-[80px]
// With border: add border border-border
```

### input

Text input field with focus state

**CSS:**
```css
.input {
  background-color: var(--rootsdk-input);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 14px 20px;
  color: var(--rootsdk-text-primary);
  font-size: 14px;
  line-height: 20px;
}

.input::placeholder {
  color: var(--rootsdk-text-tertiary);
  font-weight: 400;
}

.input:focus {
  outline: none;
  border-color: var(--rootsdk-brand-primary);
}
```

**Tailwind:**
```
// Input: bg-input border border-border rounded-xl px-5 py-3.5 text-text-primary
// Placeholder: placeholder-text-tertiary
// Focus: focus:outline-none focus:border-brand-primary
```

### button-primary

Primary action button (pill-shaped)

**CSS:**
```css
.button-primary {
  background-color: var(--rootsdk-text-primary);
  color: var(--rootsdk-background-tertiary);
  border: none;
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}

.button-primary:hover {
  opacity: 0.7;
}

.button-primary:active {
  opacity: 0.5;
  transform: scale(0.98);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Tailwind:**
```
// Primary button: bg-text-primary text-background-tertiary rounded-full px-6 py-2 font-medium
// Hover: hover:opacity-70
// Active: active:opacity-50 active:scale-[0.98]
// Disabled: disabled:opacity-50 disabled:cursor-not-allowed
```

### button-outline

Secondary outlined button (pill-shaped)

**CSS:**
```css
.button-outline {
  background-color: transparent;
  color: var(--rootsdk-text-primary);
  border: 1px solid var(--rootsdk-text-tertiary);
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}

.button-outline:hover {
  opacity: 0.7;
}

.button-outline:active {
  opacity: 0.5;
  transform: scale(0.98);
}

.button-outline:disabled {
  opacity: 0.5;
  border-color: rgba(var(--rootsdk-text-tertiary), 0.4);
  cursor: not-allowed;
}
```

**Tailwind:**
```
// Outline button: bg-transparent border border-text-tertiary rounded-full px-6 py-2 font-medium
// Hover: hover:opacity-70
// Active: active:opacity-50 active:scale-[0.98]
// Disabled: disabled:opacity-50 disabled:border-text-tertiary/40
```

### button-danger

Destructive action button

**CSS:**
```css
.button-danger {
  background-color: var(--rootsdk-error);
  color: var(--rootsdk-text-white);
  border: none;
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}

.button-danger:hover {
  opacity: 0.7;
}

.button-danger:active {
  opacity: 0.5;
  transform: scale(0.98);
}
```

**Tailwind:**
```
// Danger button: bg-error text-text-white rounded-full px-6 py-2 font-medium
// Hover: hover:opacity-70
// Active: active:opacity-50 active:scale-[0.98]
```

### modal

Modal dialog container. CAUTION: Modals are not ideal for responsive design - prefer inline-edit pattern for edit flows. If you must use a modal, ensure it works at 320px width.

**CSS:**
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  padding: 16px; /* Ensure modal doesn't touch edges on small screens */
}

.modal-content {
  background-color: var(--rootsdk-background-primary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
  max-width: 688px;
  width: 100%; /* Responsive: fill available width on small screens */
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: var(--rootsdk-background-primary);
}

.modal-title {
  font-size: 20px;
  font-weight: 450;
  line-height: 32px;
}

.modal-body {
  flex: 1;
  padding: 0 24px;
  overflow-y: auto;
}
```

**Tailwind:**
```
// CAUTION: Prefer inline-edit pattern for better responsiveness
// Overlay: fixed inset-0 bg-black/50 grid place-items-center p-4
// Content: bg-background-primary border border-border rounded-lg shadow-lg max-w-[688px] w-full max-h-[90vh]
// Header: flex items-center justify-between py-3 px-5
// Title: text-[20px] font-[450] leading-8
// Body: flex-1 px-6 overflow-y-auto
```

### inline-edit

RECOMMENDED: Inline edit pattern for responsive UIs. The item switches between view and edit modes in place, avoiding modals. Much better for small screens and mobile.

**CSS:**
```css
/* Inline edit: item toggles between view and edit mode */
.item-card {
  background-color: var(--rootsdk-background-secondary);
  border-radius: 8px;
  padding: 12px 16px;
}

/* View mode: display content with edit button */
.item-view {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.item-content {
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

/* Edit mode: inline form replaces view */
.item-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-edit-input {
  background-color: var(--rootsdk-input);
  border: 1px solid var(--rootsdk-border);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--rootsdk-text-primary);
  font-size: 14px;
  width: 100%;
}

.item-edit-input:focus {
  outline: none;
  border-color: var(--rootsdk-brand-primary);
}

.item-edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Usage: toggle isEditing state
   {isEditing ? <ItemEdit /> : <ItemView />} */
```

**Tailwind:**
```
// RECOMMENDED over modals for responsive design
// Card: bg-background-secondary rounded-lg p-3
// View mode: flex items-start justify-between gap-3
// Content: flex-1 min-w-0 (for truncation)
// Actions: flex gap-1 shrink-0
// Edit mode: flex flex-col gap-3
// Input: w-full bg-input border border-border rounded-lg px-3 py-2.5 focus:border-brand-primary
// Edit actions: flex gap-2 justify-end
```

### dropdown

Dropdown/select menu

**CSS:**
```css
.dropdown {
  position: absolute;
  z-index: 100;
  background-color: var(--rootsdk-background-tertiary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 150ms;
}

.dropdown-option:hover,
.dropdown-option.selected {
  background-color: var(--rootsdk-highlight-normal);
}
```

**Tailwind:**
```
// Dropdown: absolute z-[100] bg-background-tertiary border border-border rounded-lg p-2 shadow-lg
// Option: px-5 py-2.5 rounded-lg cursor-pointer hover:bg-highlight-normal
```

### switch

Toggle switch component

**CSS:**
```css
.switch {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: var(--rootsdk-highlight-normal);
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 150ms;
}

.switch[data-state="checked"] {
  background-color: var(--rootsdk-brand-primary);
}

.switch-thumb {
  display: block;
  width: 20px;
  height: 20px;
  background-color: var(--rootsdk-text-primary);
  border-radius: 50%;
  transition: transform 150ms;
  transform: translateX(2px);
}

.switch[data-state="checked"] .switch-thumb {
  transform: translateX(22px);
}
```

**Tailwind:**
```
// Switch track: w-[44px] h-[24px] bg-highlight-normal rounded-full cursor-pointer transition-colors
// Checked: data-[state=checked]:bg-brand-primary
// Thumb: w-[20px] h-[20px] bg-text-primary rounded-full transition-transform translate-x-[2px]
// Thumb checked: data-[state=checked]:translate-x-[22px]
```

### icon-button

Square icon button

**CSS:**
```css
.icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  aspect-ratio: 1;
  cursor: pointer;
  color: var(--rootsdk-text-tertiary);
  transition: background-color 150ms, color 150ms;
}

.icon-button:hover {
  background-color: var(--rootsdk-highlight-strong);
  color: var(--rootsdk-text-primary);
}
```

**Tailwind:**
```
// Icon button: p-1 rounded-md aspect-square flex items-center justify-center text-text-tertiary
// Hover: hover:bg-highlight-strong hover:text-text-primary
```

### list-item

Clickable list item with hover state

**CSS:**
```css
.list-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 150ms;
}

.list-item:hover {
  background-color: var(--rootsdk-highlight-normal);
}
```

**Tailwind:**
```
// List item: px-3 py-2 rounded-lg cursor-pointer hover:bg-highlight-normal
```

---

## Quick Reference

| Element | Background | Border | Radius | Padding |
|---------|------------|--------|--------|---------|
| Panel/Card | `background-secondary` | `1px border` | `12px` | `16px` |
| Input | `input` | `1px border` | `12px` | `14px 20px` |
| Button | `text-primary` | none | `9999px` (pill) | `8px 24px` |
| Modal | `background-primary` | `1px border` | `8px` | `20-24px` |
| Dropdown | `background-tertiary` | `1px border` | `8px` | `8px` |
| List Item | transparent | none | `8px` | `8px 12px` |