# Design Token Customization Guide (SPEC-UI-001)

> Guide to understanding, extending, and customizing design tokens in the Lang Quiz Claude design system.

**Last Updated**: 2025-12-06 | **Version**: 1.0.0

## Table of Contents

1. [Overview](#overview)
2. [Understanding Design Tokens](#understanding-design-tokens)
3. [Color Token Customization](#color-token-customization)
4. [Typography Customization](#typography-customization)
5. [Layout & Spacing Customization](#layout--spacing-customization)
6. [CSS Variables System](#css-variables-system)
7. [Tailwind Configuration](#tailwind-configuration)
8. [Future: Dark Mode Theme](#future-dark-mode-theme)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

Design tokens are the single source of truth for all visual decisions in the design system. They're implemented in three layers:

1. **Token Definitions** - Core values in `/app/lib/`
2. **CSS Variables** - Runtime values accessible via `var(--token-name)`
3. **Tailwind Utilities** - Pre-generated utility classes for styling

### Why Design Tokens Matter

- **Consistency**: All colors, fonts, and spacing follow predictable patterns
- **Maintainability**: Change a token once, update everywhere
- **Scalability**: Easy to add themes, dark mode, or brand variations
- **Documentation**: Self-documenting code with clear naming

## Understanding Design Tokens

### Token Categories

```
Design Tokens Structure:
├── Color Tokens
│   ├── Semantic (primary, success, warning, error, neutral)
│   └── Variants (50-950 for each color)
├── Typography Tokens
│   ├── Font families
│   ├── Font sizes
│   ├── Font weights
│   ├── Line heights
│   └── Letter spacing
└── Layout Tokens
    ├── Spacing (xs-4xl)
    ├── Border radius
    ├── Shadows
    └── Z-index
```

### Token Naming Convention

Tokens follow a hierarchical naming pattern:

```
[Category]-[Property]-[Value]

Examples:
color-primary-500         # Primary color at intensity 500
color-success-600         # Success color at intensity 600
space-md                  # Medium spacing (1rem)
text-base                 # Base font size
font-sans                 # Sans-serif font family
```

### Token Values

Each token has three representations:

```typescript
// 1. Raw value
"#3b82f6"

// 2. CSS variable
"var(--color-primary-500)"

// 3. Tailwind utility
"text-primary-500" or "bg-primary-500"
```

## Color Token Customization

### File Location

**Primary**: `/app/lib/colors/index.ts`

This file defines all semantic color tokens used throughout the system.

### Current Color System

```typescript
// Primary Colors (Blue) - Brand color
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Default primary
    600: '#2563eb',  // Hover state
    700: '#1d4ed8',  // Active state
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // ... other colors
}
```

### Customizing the Primary Color

To change the brand color from blue to another hue:

**Step 1**: Update color values in `/app/lib/colors/index.ts`

```typescript
// Change from blue to purple
primary: {
  50: '#faf5ff',   // lightest
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',  // Primary purple
  600: '#9333ea',  // Darker purple
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3f0f5c',  // Darkest
}
```

**Step 2**: Update Tailwind configuration to use new colors

The configuration automatically picks up changes from `/app/lib/colors/index.ts`.

**Step 3**: Test throughout the application

```bash
npm run dev
# Check button hover states, links, focus rings
```

### Creating New Semantic Colors

Add a new color for a specific use case:

```typescript
// In /app/lib/colors/index.ts
export const colors = {
  // ... existing colors ...

  // New custom color for premium features
  premium: {
    50: '#fef3c7',
    100: '#fde68a',
    200: '#fcd34d',
    300: '#fbbf24',
    400: '#f59e0b',
    500: '#d97706',  // Main premium color
    600: '#b45309',
    700: '#92400e',
    800: '#78350f',
    900: '#451a03',
  }
};

// Then use in Tailwind:
// <Badge variant="premium">Premium Feature</Badge>
// <div className="bg-premium-50 text-premium-700">Premium content</div>
```

### Color Accessibility Check

When customizing colors, verify accessibility compliance:

```typescript
// Before/after contrast ratio
// AA compliance requires:
// - Normal text: 4.5:1
// - Large text (18pt+): 3:1
// - UI components: 3:1

function checkContrast(foreground: string, background: string): number {
  // Use WCAG formula:
  // L1 = (0.299 × R + 0.587 × G + 0.114 × B) / 255
  // contrast = (L1 + 0.05) / (L2 + 0.05)
}

// Use online tools: contrast-ratio.com, webaim.org/resources/contrastchecker
```

## Typography Customization

### File Location

**Primary**: `/app/lib/fonts/index.ts`

This file defines font families, sizes, weights, and line heights.

### Font Family Configuration

```typescript
// Current system
fontFamily: {
  sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
  // Pretendard: Korean text optimization
  // Inter: English text (numbers, Latin)
  // system-ui: OS native fonts fallback
}
```

### Changing Font Family

**Option 1**: Keep current stack but change order

```typescript
fontFamily: {
  sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
  // Prioritize Inter for English-heavy apps
}
```

**Option 2**: Add web fonts

```typescript
// In Tailwind config
fontFamily: {
  sans: ['Poppins', 'system-ui', 'sans-serif'],
}

// In layout.tsx, add font import
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
```

### Font Size Scale

Current system uses a 1.125x ratio (8:9 scale):

```typescript
fontSize: {
  xs:   '0.75rem',   // 12px
  sm:   '0.875rem',  // 14px
  base: '1rem',      // 16px
  lg:   '1.125rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
}
```

### Customizing Font Sizes

To use a different scale (e.g., 1.25x ratio for bolder hierarchy):

```typescript
fontSize: {
  xs:    '0.75rem',   // 12px
  sm:    '0.875rem',  // 14px
  base:  '1rem',      // 16px
  lg:    '1.25rem',   // 20px  (1.25x)
  xl:    '1.5rem',    // 24px  (1.25x)
  '2xl': '1.875rem',  // 30px  (1.25x)
  '3xl': '2.25rem',   // 36px  (1.25x)
  '4xl': '2.813rem',  // 45px  (1.25x)
}
```

### Line Height Customization

```typescript
lineHeight: {
  // For headings (tight, scannable)
  tight:   '1.2',      // 20px for 16px text
  normal:  '1.5',      // 24px for 16px text

  // For body text (comfortable reading)
  relaxed: '1.625',    // 26px for 16px text

  // For code blocks
  mono:    '1.5',      // 24px for 16px monospace
}
```

### Font Weight System

```typescript
fontWeight: {
  light:   '300',
  normal:  '400',
  medium:  '500',
  semibold: '600',
  bold:    '700',
  extrabold: '800',
}

// Usage pattern
<h1 className="font-bold">Main Heading</h1>
<h2 className="font-semibold">Subheading</h2>
<p className="font-normal">Body text</p>
<p className="font-medium">Emphasized text</p>
```

## Layout & Spacing Customization

### File Location

**Primary**: `/app/lib/layout/index.ts`

This file defines spacing scale, border radius, shadows, and z-index values.

### Spacing Scale

Current 8-step system:

```typescript
spacing: {
  xs:   '0.5rem',   // 8px
  sm:   '0.75rem',  // 12px
  md:   '1rem',     // 16px
  lg:   '1.5rem',   // 24px
  xl:   '2rem',     // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
}
```

### Customizing Spacing

To use a 4-step scale instead (for more compact design):

```typescript
spacing: {
  sm:  '0.5rem',   // 8px
  md:  '1rem',     // 16px
  lg:  '1.5rem',   // 24px
  xl:  '2rem',     // 32px
}
```

### Border Radius Tokens

```typescript
borderRadius: {
  none:   '0',
  sm:     '0.375rem',  // 6px
  md:     '0.5rem',    // 8px (default)
  lg:     '0.75rem',   // 12px
  xl:     '1rem',      // 16px
  full:   '9999px',    // Circles, pills
}

// Usage
<button className="rounded-md">    {/* 8px radius */}
<div className="rounded-lg">       {/* 12px radius */}
<img className="rounded-full">     {/* Circle */}
```

### Shadow Elevation System

```typescript
boxShadow: {
  none:  'none',
  sm:    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md:    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg:    '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl:    '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
}

// Usage
<div className="shadow-sm">      {/* Subtle shadow */}
<Card className="shadow-lg">     {/* Prominent shadow */}
```

### Z-Index Scale

```typescript
zIndex: {
  auto:     'auto',
  0:        '0',
  10:       '10',      // Dropdown, tooltip
  20:       '20',      // Fixed header
  30:       '30',      // Sticky elements
  40:       '40',      // Modal overlay
  50:       '50',      // Modal dialog
  60:       '60',      // Toast, notification
  auto:     'auto',
}

// Usage
<header className="sticky top-0 z-20">   {/* Below modals */}
<Dialog className="z-50">                {/* Above everything */}
```

## CSS Variables System

### How CSS Variables Work

Design tokens are exposed as CSS variables for runtime customization:

```css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  /* ... */
  --space-md: 1rem;
  --text-base: 1rem;
}
```

### Using CSS Variables in Components

```tsx
// Direct CSS variable usage
<div style={{ backgroundColor: 'var(--color-primary-500)' }}>
  {/* Uses primary-500 */}
</div>

// More common: Use Tailwind classes
<div className="bg-primary-500">
  {/* Tailwind translates to var(--color-primary-500) */}
</div>
```

### Runtime Theme Switching with CSS Variables

Future implementation for dark mode:

```typescript
// theme.ts
export function setTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;

  if (theme === 'dark') {
    // Update all CSS variables for dark theme
    root.style.setProperty('--color-primary-500', '#60a5fa');
    root.style.setProperty('--color-neutral-900', '#f9fafb');
    // ... set all dark mode variables
  } else {
    // Light mode (reset to defaults)
    root.removeAttribute('style');
  }
}
```

## Tailwind Configuration

### Extending Tailwind Config

Location: `/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Import custom colors
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          // ...
        },
      },
      spacing: {
        // Custom spacing tokens
        xs: '0.5rem',
        md: '1rem',
        // ...
      },
      fontSize: {
        // Custom type scale
        xs: '0.75rem',
        base: '1rem',
        // ...
      },
    },
  },
} satisfies Config;
```

### Creating New Utility Classes

```typescript
// In tailwind.config.ts
export default {
  theme: {
    extend: {
      backgroundColor: {
        // Create custom utilities
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      borderColor: {
        'custom': '#your-color',
      },
    },
  },
}

// Usage
<div className="bg-glass">      {/* Uses custom utility */}
<div className="border border-custom">
```

## Future: Dark Mode Theme

### Implementation Strategy

The design system is architected for dark mode expansion:

```typescript
// Future: Dark mode color tokens
export const colorsDark = {
  primary: {
    50: '#001f3f',    // Very dark blue
    500: '#60a5fa',   // Lighter blue
    950: '#ffffff',   // Inverted
  },
  neutral: {
    50: '#030712',    // Dark background
    900: '#f9fafb',   // Light text
  },
}

// Implementation approach:
// 1. Define dark mode tokens parallel to light mode
// 2. Use CSS variables with media query detection
// 3. Allow manual theme switching
```

### Dark Mode Media Query

```css
/* Automatic based on system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --color-neutral-900: #f9fafb;  /* Light text on dark bg */
    --color-primary-500: #60a5fa;  /* Lighter blue */
  }
}
```

## Best Practices

### 1. Token Naming

✅ **Good**:
```typescript
color-primary-500      // Semantic, clear purpose
space-lg               // Consistent naming
text-xl                // Descriptive
```

❌ **Bad**:
```typescript
blue-500               // Too generic
my-custom-spacing      // Not scalable
header-font-size       // Location-dependent
```

### 2. Using Tokens

✅ **Good**:
```tsx
<Button className="bg-primary-600 text-white">
  {/* Uses semantic color tokens */}
</Button>
```

❌ **Bad**:
```tsx
<Button className="bg-blue-600 text-white">
  {/* Hard-coded color, not maintainable */}
</Button>
```

### 3. Extending vs. Modifying

✅ **Good - Extend**:
```typescript
// Add without breaking existing
theme: {
  extend: {
    colors: {
      brand: { 500: '#ff0000' }
    }
  }
}
```

❌ **Bad - Override**:
```typescript
// Replaces all default tokens
theme: {
  colors: {
    primary: { 500: '#ff0000' }
  }
}
```

### 4. Documentation

Always document custom tokens:

```typescript
// Color tokens for word learning features
colors: {
  // Used for: Active learning state, learning progress
  learning: {
    500: '#8b5cf6',  // Purple - focus/concentration
  },

  // Used for: Completed reviews, mastered words
  mastered: {
    500: '#10b981',  // Green - achievement
  }
}
```

## Troubleshooting

### Colors not updating

**Problem**: Changed color token but styles don't update
**Solution**:
1. Rebuild Tailwind CSS: `npm run dev`
2. Clear Tailwind cache: `rm -rf .next`
3. Verify token is exported in `/app/lib/colors/index.ts`
4. Check `tailwind.config.ts` includes the color in theme.extend

### Spacing inconsistency

**Problem**: Spacing doesn't match design tokens
**Solution**:
1. Use only token values: `p-md` not `p-5`
2. Check token definition in `/app/lib/layout/index.ts`
3. Verify Tailwind config extends spacing correctly

### Font not applying

**Problem**: Typography system fonts not rendering
**Solution**:
1. Check font is imported in `app/layout.tsx`
2. Verify `fontFamily` in Tailwind config
3. Check font files are in `public/fonts/` or loaded from CDN
4. Clear browser cache

### Dark mode colors inverted

**Problem**: Colors look wrong on dark backgrounds
**Solution**:
1. Add explicit dark mode colors in token system
2. Use `dark:` utilities: `dark:bg-neutral-900`
3. Test with `prefers-color-scheme: dark` media query

---

**Document Status**: Complete | **Last Reviewed**: 2025-12-06 | **Version**: 1.0.0
