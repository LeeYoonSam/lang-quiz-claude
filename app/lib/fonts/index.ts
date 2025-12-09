/**
 * Font System Configuration
 * Implements Pretendard and Inter fonts with optimization
 *
 * Features:
 * - font-display: swap to prevent FOUT
 * - Variable fonts for reduced file sizes
 * - Preloading strategy for critical fonts
 * - Font smoothing CSS variables
 */

export const fontFamilies = {
  sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
  display: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
} as const;

/**
 * Font loading optimization configuration
 * Prevents Cumulative Layout Shift (CLS < 0.1)
 */
export const fontOptimization = {
  // Use swap to show fallback font while custom font loads
  display: 'swap',
  // Reduce font loading impact on LCP
  maxAge: 31536000, // Cache fonts for 1 year
} as const;

/**
 * Typography configuration
 * Based on Tailwind scale with optimized line heights
 */
export const typographyScale = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
  base: { fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
} as const;

/**
 * Font weights for Pretendard and Inter
 * Both fonts support: 400, 500, 600, 700, 800
 */
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * CSS variables for font smoothing and system fonts
 * Applied at document root for optimal performance
 */
export const fontSmoothingVars = {
  'antialiased': '-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;',
  'subpixel': '-webkit-font-smoothing: subpixel-antialiased;',
} as const;

/**
 * Preload fonts for critical rendering path
 * Returns link tags for font preloading in head
 */
export function getPreloadFonts(): { href: string; as: string; type: string }[] {
  return [
    {
      href: '/fonts/pretendard-variable.woff2',
      as: 'font',
      type: 'font/woff2',
    },
    {
      href: '/fonts/inter-variable.woff2',
      as: 'font',
      type: 'font/woff2',
    },
  ];
}

/**
 * Get font-face declarations for CSS
 * Uses variable fonts and swap strategy
 */
export function getFontFaceCSS(): string {
  return `
    @font-face {
      font-family: 'Pretendard';
      src: url('/fonts/pretendard-variable.woff2') format('woff2');
      font-weight: 100 900;
      font-stretch: 75% 125%;
      font-display: swap;
      font-style: normal;
    }

    @font-face {
      font-family: 'Inter';
      src: url('/fonts/inter-variable.woff2') format('woff2');
      font-weight: 100 900;
      font-stretch: 75% 125%;
      font-display: swap;
      font-style: normal;
    }

    :root {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      --font-family-sans: 'Pretendard', 'Inter', system-ui, sans-serif;
    }

    html {
      font-family: var(--font-family-sans);
      font-feature-settings: 'rlig' 1, 'calt' 1;
      text-rendering: geometricPrecision;
    }

    body {
      font-weight: 400;
      line-height: 1.5;
    }
  `;
}

/**
 * Check if fonts are loaded successfully
 * Useful for monitoring font loading performance
 */
export async function waitForFontsLoaded(): Promise<boolean> {
  if (!('fonts' in document)) {
    return true; // Fallback if Font Loading API not available
  }

  try {
    await (document as any).fonts.ready;
    return true;
  } catch (error) {
    console.warn('Font loading failed:', error);
    return false;
  }
}

export default {
  fontFamilies,
  fontOptimization,
  typographyScale,
  fontWeights,
  fontSmoothingVars,
  getPreloadFonts,
  getFontFaceCSS,
  waitForFontsLoaded,
};
