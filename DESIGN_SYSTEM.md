# Lang Quiz Design System (SPEC-UI-001)

## Overview

The Lang Quiz Design System is a comprehensive, accessible UI framework built on Next.js 15, React 19, TypeScript 5.9, and Tailwind CSS 4.1. This document outlines the design tokens, component library, and implementation guidelines.

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Library](#component-library)
3. [Typography System](#typography-system)
4. [Color System](#color-system)
5. [Layout System](#layout-system)
6. [Accessibility](#accessibility)
7. [Performance Optimization](#performance-optimization)
8. [Usage Examples](#usage-examples)

---

## Design Tokens

### Font System

**Fonts Implemented:**
- **Pretendard**: Primary font family for Korean language support
- **Inter**: Fallback for English and technical content

**Font Configuration:**
```typescript
--font-family-sans: 'Pretendard', 'Inter', system-ui, sans-serif;
```

**Optimization:**
- ✓ Font-display: swap (prevents FOUT)
- ✓ Variable fonts (reduced file sizes)
- ✓ Preload critical fonts
- ✓ Font smoothing CSS variables
- ✓ CLS < 0.1 (Cumulative Layout Shift)

### Spacing System

Mobile-first responsive spacing:
- `xs: 0.5rem` (8px)
- `sm: 0.75rem` (12px)
- `md: 1rem` (16px)
- `lg: 1.5rem` (24px)
- `xl: 2rem` (32px)
- `2xl: 3rem` (48px)

### Shadow System

```
- xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

### Border Radius

```
- none: 0px
- sm: 0.125rem (2px)
- base: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- 2xl: 1.5rem (24px)
- full: 9999px (rounded)
```

---

## Component Library

### Button Component

**Variants:** 4 variants × 3 sizes = 12 combinations

```typescript
// Variants
- primary: Solid background (main actions)
- secondary: Gray background (secondary actions)
- outline: Border only (alternative actions)
- ghost: Text only (tertiary actions)

// Sizes
- sm: 12px padding, 14px font
- md: 16px padding, 16px font (default)
- lg: 24px padding, 18px font
```

**Features:**
- Loading state with spinner
- Disabled state management
- Full keyboard support
- Focus indicators
- Smooth transitions

**Usage:**
```tsx
import { Button } from '@/app/components/ui';

<Button variant="primary" size="md" loading={false}>
  Save Changes
</Button>
```

### Card Component

**Components:**
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title (h3)
- `CardDescription`: Subtitle text
- `CardFooter`: Footer with border

**Variants:**
- `default`: Static card with shadow
- `interactive`: Hover effects, cursor pointer

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui';

<Card variant="interactive">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>
```

### Input Component

**Features:**
- Label support with required indicator
- Error state with error message
- Helper text support
- ARIA labels and descriptions
- Focus indicators

**Usage:**
```tsx
import { Input } from '@/app/components/ui';

<Input
  label="Email Address"
  type="email"
  placeholder="user@example.com"
  error={errors.email}
  required
/>
```

### Dialog Component

**Components:**
- `Dialog`: Context provider
- `DialogTrigger`: Open button
- `DialogContent`: Modal container
- `DialogOverlay`: Backdrop
- `DialogTitle`: Heading (h2)
- `DialogDescription`: Body text
- `DialogFooter`: Action buttons

**Features:**
- Focus trap
- Escape key closes
- Click outside closes
- Smooth animations
- Accessible keyboard navigation

**Usage:**
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from '@/app/components/ui';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogTitle>Confirm Action</DialogTitle>
    <p>Are you sure?</p>
    <DialogFooter>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Badge Component

**Variants:** primary, secondary, success, warning, error
**Sizes:** sm (small), md (medium)

**Usage:**
```tsx
import { Badge } from '@/app/components/ui';

<Badge variant="success" size="md">
  Active
</Badge>
```

### Skeleton Component

**Variants:** text, card, avatar
**Features:** Animate pulse loading state

**Usage:**
```tsx
import { Skeleton } from '@/app/components/ui';

<Skeleton variant="card" count={3} />
```

### Grid Component (NEW)

**Purpose:** Mobile-first responsive grid layouts

```tsx
import { Grid } from '@/app/components/ui';

// 1 column mobile, 2 columns on tablet, 3 on desktop
<Grid cols={1} mdCols={2} lgCols={3} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Container Component (NEW)

**Purpose:** Constrain content width with responsive padding

```tsx
import { Container } from '@/app/components/ui';

<Container maxWidth="7xl">
  <h1>Page Title</h1>
  <p>Content here</p>
</Container>
```

### Stack Component (NEW)

**Purpose:** Flexible layout for stacking items

```tsx
import { Stack } from '@/app/components/ui';

// Stack vertically on mobile, horizontally on desktop
<Stack responsive direction="row" gap={4}>
  <button>Action 1</button>
  <button>Action 2</button>
</Stack>
```

---

## Typography System

### Font Scale

| Class | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 0.75rem | 1rem | Captions, small text |
| `text-sm` | 0.875rem | 1.25rem | Labels, secondary text |
| `text-base` | 1rem | 1.5rem | Body text (default) |
| `text-lg` | 1.125rem | 1.75rem | Large body text |
| `text-xl` | 1.25rem | 1.75rem | Small headings |
| `text-2xl` | 1.5rem | 2rem | Section headings |
| `text-3xl` | 1.875rem | 2.25rem | Page headings |
| `text-4xl` | 2.25rem | 2.5rem | Hero headings |

### Heading Styles

```css
.text-display-xl  /* text-4xl, font-bold, tracking-tight */
.text-display-lg  /* text-3xl, font-bold, tracking-tight */
.text-headline    /* text-2xl, font-semibold, tracking-tight */
.text-title       /* text-xl, font-semibold */
.text-body        /* text-base, font-normal, leading-relaxed */
.text-label       /* text-sm, font-medium */
.text-caption     /* text-xs, font-normal, text-neutral-600 */
```

### Font Weights

- Light: 300
- Normal: 400 (default)
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Line Height Guidelines

- **Headings**: 1 - 1.2 (tight spacing)
- **Body**: 1.5 - 1.75 (comfortable reading)
- **Large text**: 1.4 - 1.6 (adequate spacing)

---

## Color System

### Semantic Color Scale (9-step)

Each color has 10-11 shades from 50 (lightest) to 950 (darkest):

#### Primary (Blue) - Main brand color
- 50-500: Backgrounds and accents
- 600: WCAG AA compliant text color (5.9:1 ratio)
- 700: Interactive states
- 800-900: Dark text

#### Success (Green) - Positive actions
- 50-500: Success indicators
- 600: WCAG AA compliant text (4.6:1 ratio)
- 700+: Dark states

#### Warning (Amber) - Caution states
- 50-500: Warning backgrounds
- 600: WCAG AA compliant text (4.5:1 ratio)
- 700+: Emphasized states

#### Error (Red) - Destructive actions
- 50-500: Error backgrounds
- 600: WCAG AA compliant text (5.9:1 ratio)
- 700+: Dark error states

#### Neutral (Gray) - Text and backgrounds
- 50: Page background
- 100: Card backgrounds
- 200: Border (light)
- 300: Border (medium)
- 400: Disabled text
- 500: Secondary text
- 600: Tertiary text
- 700-800: Body text
- 900: Primary text
- 950: Black backgrounds

### Contrast Ratios (WCAG AA Compliant)

All colors meet WCAG AA standards (4.5:1 minimum):

- Primary-600 on white: **5.9:1**
- Success-600 on white: **4.6:1**
- Warning-600 on white: **4.5:1**
- Error-600 on white: **5.9:1**
- Neutral-900 on white: **13.3:1**

### CSS Variables

All colors available as CSS variables:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-text-primary: #111827;
  --color-border: #d1d5db;
  /* ... and more */
}

/* Dark mode automatically switches colors */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #60a5fa;
    --color-background: #030712;
    /* ... */
  }
}
```

---

## Layout System

### Responsive Breakpoints

Mobile-first approach (min-width):

| Breakpoint | Size | Device Type |
|-----------|------|------------|
| Base (xs) | 0px | Mobile |
| sm | 640px | Small devices |
| md | 768px | Tablets |
| lg | 1024px | Small desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Extra-large desktops |

### Grid System

**Mobile-first column defaults:**

```tsx
// Start with 1 column, expand as needed
<Grid cols={1} mdCols={2} lgCols={3} gap={4} />

// Produces:
// Mobile: 1 column
// Tablet (768px+): 2 columns
// Desktop (1024px+): 3 columns
```

### Responsive Spacing

```
Mobile:  padding: 1rem, gap: 1rem
Tablet:  padding: 1.5rem, gap: 1.5rem
Desktop: padding: 2rem, gap: 2rem
```

### Container Constraints

```
max-w-7xl = 1280px (standard content width)
Responsive padding: 1rem (mobile) → 2rem (desktop)
```

### Responsive Utilities

```css
/* Stack vertically on mobile, horizontally on desktop */
flex flex-col md:flex-row gap-4 md:gap-6

/* 1 column mobile, 2 on tablet, 3 on desktop */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4

/* Hide on mobile, show on sm+ */
hidden sm:block

/* Show on mobile only */
block sm:hidden
```

---

## Accessibility

### WCAG 2.1 AA Compliance

All components meet or exceed WCAG 2.1 AA standards:

- ✓ **AC-11**: 0 critical axe issues
- ✓ **AC-12**: Full keyboard navigation
- ✓ **AC-13**: Complete screen reader support

### Keyboard Navigation

**Supported Keys:**

| Key | Function |
|-----|----------|
| `Tab` | Focus next element |
| `Shift + Tab` | Focus previous element |
| `Enter` | Activate buttons, submit forms |
| `Space` | Activate buttons (alternative) |
| `Escape` | Close modals/dialogs |
| `Arrow Keys` | Navigate menus/lists |

### Semantic HTML

All components use semantic HTML:

- `<button>` for interactive buttons
- `<label>` for form field labels
- `<h1>-<h6>` for headings
- `<nav>`, `<main>`, `<footer>` for landmarks
- `<input>`, `<textarea>`, `<select>` for form fields

### ARIA Attributes

Proper ARIA implementation:

```html
<!-- Form error handling -->
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error">Invalid email format</span>

<!-- Modal dialogs -->
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <h2 id="title">Dialog Title</h2>
</div>

<!-- Icon buttons -->
<button aria-label="Close dialog">✕</button>
```

### Focus Management

- ✓ Visible focus indicators (2px ring)
- ✓ Logical tab order (follows visual order)
- ✓ Focus trap in modals
- ✓ Focus restoration after modal close

### Color Contrast

- Normal text: **4.5:1 minimum**
- Large text (18pt+): **3:1 minimum**
- All interactive elements: **3:1 minimum**

### Touch Targets

All interactive elements are **at least 44×44 CSS pixels**

### Motion and Animation

- Respects `prefers-reduced-motion`
- No auto-playing animations by default
- Smooth transitions (0.2-0.3 seconds)

---

## Performance Optimization

### Font Loading

**Metrics:**
- LCP: < 2.5s
- CLS: < 0.1
- FID: < 100ms

**Optimizations:**
- Font-display: swap (show fallback while loading)
- Variable fonts (single file for all weights)
- Preload critical fonts
- Font smoothing CSS variables

### Core Web Vitals

```
✓ LCP (Largest Contentful Paint): 2.5s target
✓ CLS (Cumulative Layout Shift): 0.1 target
✓ FID (First Input Delay): 100ms target
```

### Code Splitting

- Components imported from `@/app/components/ui`
- Tree-shakeable exports
- Minimal bundle size

### CSS Optimization

- Tailwind CSS purges unused styles
- CSS variables for theming (no duplication)
- Efficient color scale (no calc() needed)

---

## Usage Examples

### Creating a Page with Design System

```tsx
import { Container, Grid, Card, Button, Input } from '@/app/components/ui';

export default function Page() {
  return (
    <Container maxWidth="7xl">
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <h1 className="text-display-lg mb-4">Page Title</h1>
        <p className="text-body text-neutral-600">Introduction text</p>
      </section>

      {/* Content Grid */}
      <Grid cols={1} mdCols={2} lgCols={3} gap={6} className="mb-12">
        <Card>
          <h2 className="text-title mb-2">Card 1</h2>
          <p>Description</p>
        </Card>
        <Card>
          <h2 className="text-title mb-2">Card 2</h2>
          <p>Description</p>
        </Card>
        <Card>
          <h2 className="text-title mb-2">Card 3</h2>
          <p>Description</p>
        </Card>
      </Grid>

      {/* Form Section */}
      <Card>
        <h2 className="text-headline mb-6">Contact Form</h2>
        <form className="space-y-4">
          <Input
            label="Name"
            placeholder="Your name"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <div className="flex gap-4">
            <Button variant="primary">Submit</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
```

### Responsive Layouts

```tsx
// Mobile-first grid
<Grid cols={1} mdCols={2} lgCols={4} gap={4} responsiveGap>
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</Grid>

// Responsive flex stack
<Stack responsive direction="row" gap={4}>
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
</Stack>

// Hide/show responsive
<div className="hidden md:block">Desktop only content</div>
<div className="md:hidden">Mobile only content</div>
```

### Form with Validation

```tsx
import { Input, Button } from '@/app/components/ui';

export function LoginForm() {
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        error={errors.email}
        aria-invalid={!!errors.email}
      />
      <Input
        label="Password"
        type="password"
        error={errors.password}
        aria-invalid={!!errors.password}
      />
      <Button variant="primary" type="submit">
        Sign In
      </Button>
    </form>
  );
}
```

---

## Testing

### Test Coverage

- **Component Tests**: 95+ passing tests
- **Accessibility Tests**: Full WCAG 2.1 AA compliance
- **Layout Tests**: 28+ responsive design tests
- **Font & Typography Tests**: 18+ optimization tests
- **Color System Tests**: 29+ contrast ratio tests

### Running Tests

```bash
# All tests
npm test

# Component tests only
npm test -- Button Dialog Card

# Coverage report
npm test -- --coverage

# Watch mode
npm test:watch
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **WCAG 2.1 AA**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Practices**: https://www.w3.org/WAI/ARIA/apg/

---

## Version History

- **v1.0.0** (2025-12-06): Initial design system implementation
  - Font & Typography System
  - Color System (9-step scales, WCAG AA compliant)
  - Component Library (Button, Card, Input, Dialog, Badge, Skeleton)
  - Responsive Layout System (Grid, Container, Stack)
  - Full WCAG 2.1 AA accessibility support
  - Dark mode support via CSS variables
