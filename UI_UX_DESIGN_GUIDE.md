# Collaborative Document Editor

## UI/UX Design Guide

This guide is the frontend design source of truth for the assessment. Build a professional, credible productivity tool while prioritizing functional completeness and implementation speed. Reach the quality threshold described here, then return effort to core product behavior.

## 1. Design Principles

- Calm, minimal, desktop-first productivity-app aesthetic.
- Make creating, editing, saving, importing, ownership, and sharing immediately understandable.
- Prefer familiar controls and explicit labels over novelty.
- Use consistent spacing, typography, borders, and states instead of decorative detail.
- Keep the interface usable at narrower desktop widths, but do not build complex mobile behavior.
- Do not add visual polish that risks the core flow, deployment, testing, or submission buffer.

## 2. Visual Tokens

Use CSS custom properties so these values remain consistent without building a custom design system.

### Color

| Token | Value | Use |
| --- | --- | --- |
| Workspace | `#F8FAFC` | App and editor-area background |
| Surface | `#FFFFFF` | Sidebar, dialogs, document page, inputs |
| Primary text | `#0F172A` | Titles and main content |
| Secondary text | `#475569` | Labels and supporting information |
| Muted text | `#64748B` | Timestamps, hints, empty-state copy |
| Border | `#E2E8F0` | Dividers and control borders |
| Primary | `#4F46E5` | Primary actions, selection, active tools, focus |
| Primary hover | `#4338CA` | Primary-action hover |
| Success | `#16A34A` | Saved and completed states |
| Warning | `#D97706` | Unsaved/in-progress attention |
| Error | `#DC2626` | Errors and destructive actions |

Do not communicate state through color alone. Pair color with text, an icon, control state, or another visible cue.

### Typography

- Font: Inter when readily available; otherwise use the system sans-serif stack.
- Body: `14–16px`, line height `1.5–1.6`.
- Sidebar labels and metadata: `12–14px`.
- Document title: approximately `24px`, semibold.
- Editor body: `16px`, comfortable reading line height around `1.7`.
- Use weight and size deliberately; avoid many text styles.

### Spacing and Shape

- Base spacing unit: `8px`.
- Common gaps/padding: `8px`, `16px`, `24px`, and `32px`.
- Small control radius: `6px`.
- Inputs, buttons, and cards: `8px`.
- Dialog radius: `12px`.
- Use subtle `1px` borders.
- Use shadows only for the document page and modal, and keep them very light.
- Minimum interactive target height: approximately `36–40px`.

## 3. Application Layout

Use a full-height application shell with two primary regions.

### Left Sidebar

- Width: approximately `240–280px`.
- Compact, fixed on desktop, with a white surface and right border.
- Top area contains the product name and the New Document primary action.
- Import File is a clear secondary action directly below.
- Display helper text such as `Supports .txt and .md` near import.
- Show two labeled groups:
  - **My Documents**
  - **Shared With Me**
- Document rows show a title, selection state, and optional concise owner metadata for shared items.
- Long titles truncate with an accessible full-title tooltip or `title` attribute.
- Document lists scroll independently when needed.

### Main Workspace

- Fill the remaining width with the Slate-50 workspace background.
- The workspace header contains:
  - Editable document title on the left
  - Share action near the title or on the right
  - Simulated user switcher in the top-right
- Place the rich-text toolbar below the header.
- Center a white document/editor surface within the workspace.
- Suggested page width: `760–900px`, with `40–64px` internal padding.
- Keep save status visible near the title or bottom-right of the editor header; do not use a disruptive toast for routine saving.
- When no document is selected, show a purposeful empty state instead of an empty editor.

## 4. Core Components

### Buttons

- Primary: Indigo background, white text; use for New Document, Save, and final Share confirmation.
- Secondary: White/slate surface with border; use for Import and dialog cancellation.
- Destructive: Red treatment; reserve for deletion.
- Toolbar buttons: Neutral by default; indigo-tinted background/border and `aria-pressed="true"` when active.
- Every icon-only button requires an `aria-label` and visible tooltip/title.
- Disabled controls must look disabled and remain readable.

### Document Rows

- Entire row is a button or link with a visible focus state.
- Selected row uses a light indigo surface plus a clear indicator, not color alone.
- Owned and shared documents remain in separately labeled sections.
- Shared rows display `Shared by {owner}` or equivalent concise ownership context.

### Editable Title

- Visually reads as the document title, not a generic form field.
- Shows a border/focus treatment when active.
- Has an accessible label even if the visible design omits a separate label.
- Blank titles produce an inline error and are not saved.

### Rich-Text Toolbar

Provide only:

- Bold
- Italic
- Underline
- Heading 1
- Heading 2
- Bullet list
- Numbered list

Use grouped controls with separators only where helpful. Each tool must have a clear label or familiar symbol, tooltip, `aria-label`, and active state. Keep toolbar behavior sticky only if it is quick and reliable.

### User Switcher

- Show `Viewing as` plus the active user's name.
- Place it consistently in the top-right.
- Use a native select or a simple accessible menu; avoid a custom dropdown unless necessary.
- On switch, reload owned/shared documents and clear inaccessible selections.

### Share Dialog

- Use a small centered modal with a title, concise explanation, labeled seeded-user select, Cancel, and Share actions.
- Show only eligible users: not the owner and not already shared.
- Explain that shared users can edit.
- Disable submission while sharing and show inline failure feedback.
- On success, close the dialog and show concise confirmation.
- The owner alone sees the Share action.

### Import Control

- Use a native file input triggered by the Import File action.
- Set accepted extensions to `.txt,.md`.
- State supported formats visibly before selection.
- Show a concise importing state and understandable inline/toast result.
- On success, add and open the new document.
- On failure, preserve the current document and explain what went wrong.

## 5. Required States and Feedback

### Document Selection

- No document: explain how to create or import one.
- Loading: show a stable workspace with a concise loading message or lightweight skeleton.
- Loaded: show title, ownership context, toolbar, editor, and save controls.
- Load failure: show a retry action and readable error.

### Save State

Always show text, optionally paired with an icon:

- `Unsaved changes` — Amber
- `Saving…` — neutral or Amber; disable duplicate submission
- `Saved` — Green
- `Save failed` — Red with Retry or retained Save action

Never clear dirty state until the server confirms success. Guard document or user switching when unsaved content exists.

### Empty States

- My Documents: `No documents yet` with a New Document action.
- Shared With Me: `Nothing has been shared with you yet.`
- No selection: `Select a document, create a new one, or import a .txt/.md file.`
- No eligible share targets: explain that the document is already shared with all other users.

### Errors

- Use concise human-readable messages near the affected control or in a small app-level alert.
- Never expose raw server exceptions.
- Preserve user-entered document content after a failed save.
- Provide a clear retry when recovery is possible.

### Unsaved Changes

- Use an application modal for document, user, and new-document navigation when edits are unsaved.
- Clearly offer **Keep editing** and **Discard changes**; default focus goes to the safe Keep editing action.
- Keep the current user/document visibly selected until discard is confirmed.
- Escape and backdrop interaction cancel navigation and preserve edits.
- Browser refresh/close may use the browser-native unload warning because custom UI cannot safely replace that lifecycle prompt.

### Unsaved Changes

- Use an application modal for document, user, and new-document navigation when edits are unsaved.
- Clearly offer **Keep editing** and **Discard changes**; default focus goes to the safe Keep editing action.
- Keep the current user/document visibly selected until discard is confirmed.
- Escape and backdrop interaction cancel navigation and preserve edits.
- Browser refresh/close may use the browser-native unload warning because custom UI cannot safely replace that lifecycle prompt.

## 6. Accessibility Requirements

- Use semantic landmarks: `aside`, `nav`, `header`, `main`, and appropriately structured headings.
- Use native `button`, `input`, `select`, and dialog semantics wherever possible.
- Every form control has a visible label or accessible name.
- Use `aria-pressed` for toggle-formatting buttons.
- Use `aria-live="polite"` for save status and non-critical operation feedback.
- Use `role="alert"` for errors requiring immediate attention.
- Provide visible keyboard focus using an indigo outline/ring with sufficient contrast.
- Maintain logical keyboard order and support closing dialogs with Escape.
- Move focus into an opened dialog and return it to the triggering control when closed.
- Ensure text and controls meet WCAG AA contrast expectations.
- Do not rely only on hover, color, or iconography to explain functionality.

## 7. Interaction Priorities

Implement in this order:

1. Clear application layout and document navigation.
2. Understandable selected, owned, and shared states.
3. Reliable editor controls and explicit Save feedback.
4. User switching and sharing dialog.
5. Import states and error handling.
6. Keyboard/focus/accessibility verification.
7. Basic spacing, typography, borders, and responsive tolerance.
8. Additional polish only after the deployed core flow passes.

## 8. Responsive Boundary

- Optimize for desktop widths around `1024px` and above.
- At narrower widths, allow the sidebar to reduce toward `220px` and editor padding to reduce.
- Avoid overlapping controls and horizontal page scrolling at common laptop widths.
- A mobile drawer, mobile toolbar redesign, and advanced responsive behavior are not required.

## 9. Explicitly Out of Scope

Do not spend assessment time on:

- Custom branding or logo work
- Landing or marketing pages
- Gradients or glassmorphism
- Elaborate animations or page transitions
- Dark mode
- Decorative graphics or illustrations
- Complex mobile layouts
- A custom design-system package
- Excessive shadows, effects, or ornamental UI
- Pixel-perfect imitation of another editor

## 10. UI Completion Threshold

The UI is complete enough when a reviewer can immediately identify the active user, create or import a document, distinguish owned from shared documents, edit and format content, understand whether changes are saved, share as the owner, and recover from common errors. Once these behaviors are clear, accessible, consistent, and credible, stop polishing and return effort to functionality, deployment, testing, and submission readiness.

## 11. Frontend Environment Rule

- Obtain the API base URL from `VITE_API_BASE_URL`; never hardcode local or deployed API origins in components or API clients.
- Compose the base URL with relative endpoint paths defined by the REST contract.
- Fail with a clear startup/configuration message when the API base URL is missing.
- Treat all `VITE_*` values as public browser data and never place credentials or secrets in them.
