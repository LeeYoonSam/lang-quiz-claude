/**
 * Responsive Layout System Configuration
 * Mobile-first grid layouts and breakpoint utilities
 *
 * AC-9: Mobile-first grid (1/2/3 column layouts)
 * AC-10: Responsive breakpoints (sm, md, lg, xl, 2xl)
 */

/**
 * Tailwind CSS Breakpoints
 * Used for responsive design with mobile-first approach
 */
export const breakpoints = {
  xs: 0, // Mobile
  sm: 640, // Small devices
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices
  xl: 1280, // Extra large devices
  '2xl': 1536, // 2X large devices
} as const;

/**
 * Breakpoint names for easy reference
 */
export const breakpointNames = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/**
 * Media query helpers for responsive design
 */
export const mediaQueries = {
  sm: '@media (min-width: 640px)', // 640px+
  md: '@media (min-width: 768px)', // 768px+
  lg: '@media (min-width: 1024px)', // 1024px+
  xl: '@media (min-width: 1280px)', // 1280px+
  '2xl': '@media (min-width: 1536px)', // 1536px+
} as const;

/**
 * Container Width Constraints
 * Used for limiting max-width of main content areas
 */
export const containerSizes = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '7xl': '80rem', // max-w-7xl (1280px)
} as const;

/**
 * Responsive spacing scale
 * Maps screen sizes to padding and margin values
 */
export const responsiveSpacing = {
  mobile: {
    padding: '1rem', // p-4
    marginVertical: '0.75rem', // my-3
    marginHorizontal: '1rem', // mx-4
    gap: '1rem', // gap-4
  },
  tablet: {
    padding: '1.5rem', // p-6
    marginVertical: '1rem', // my-4
    marginHorizontal: '1.5rem', // mx-6
    gap: '1.5rem', // gap-6
  },
  desktop: {
    padding: '2rem', // p-8
    marginVertical: '1.5rem', // my-6
    marginHorizontal: '2rem', // mx-8
    gap: '2rem', // gap-8
  },
} as const;

/**
 * Grid Column Configurations
 * Mobile-first approach: start with 1 column, increase at breakpoints
 */
export const gridColumns = {
  mobile: 1, // 1 column on mobile
  sm: 2, // 2 columns at sm breakpoint (640px)
  md: 3, // 3 columns at md breakpoint (768px)
  lg: 3, // Keep 3 columns at lg
  xl: 4, // 4 columns at xl breakpoint (1280px)
  '2xl': 4, // Keep 4 columns at 2xl
} as const;

/**
 * Responsive typography scale
 * Font sizes adapt to screen size
 */
export const responsiveTypography = {
  heading1: {
    mobile: { fontSize: '1.875rem', lineHeight: '2.25rem' }, // text-3xl
    md: { fontSize: '2.25rem', lineHeight: '2.5rem' }, // text-4xl
    lg: { fontSize: '2.25rem', lineHeight: '2.5rem' },
  },
  heading2: {
    mobile: { fontSize: '1.5rem', lineHeight: '2rem' }, // text-2xl
    md: { fontSize: '1.875rem', lineHeight: '2.25rem' }, // text-3xl
    lg: { fontSize: '1.875rem', lineHeight: '2.25rem' },
  },
  heading3: {
    mobile: { fontSize: '1.25rem', lineHeight: '1.75rem' }, // text-xl
    md: { fontSize: '1.5rem', lineHeight: '2rem' }, // text-2xl
    lg: { fontSize: '1.5rem', lineHeight: '2rem' },
  },
  body: {
    mobile: { fontSize: '1rem', lineHeight: '1.5rem' }, // text-base
    md: { fontSize: '1.125rem', lineHeight: '1.75rem' }, // text-lg
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  },
} as const;

/**
 * Common responsive grid classes (Tailwind CSS)
 * Ready to use in components
 */
export const gridClasses = {
  // Single column on mobile, 2 columns on small screens
  cols1To2: 'grid grid-cols-1 sm:grid-cols-2',

  // Single column on mobile, 2 on tablet, 3 on desktop
  cols1To3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',

  // Single column on mobile, 2 on tablet, 4 on desktop
  cols1To4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',

  // Responsive with gap
  cols1To3WithGap: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',

  // Flex responsive
  flexColToRow: 'flex flex-col md:flex-row gap-4 md:gap-6',
} as const;

/**
 * Container query utilities
 * For component-level responsive design
 */
export const containerQueries = {
  sm: '@container (min-width: 400px)',
  md: '@container (min-width: 600px)',
  lg: '@container (min-width: 900px)',
} as const;

/**
 * Get responsive value for specific breakpoint
 * Usage: getValue('mobile', 'padding') // returns '1rem'
 */
export function getResponsiveValue(
  breakpoint: keyof typeof responsiveSpacing,
  property: keyof (typeof responsiveSpacing)['mobile']
): string {
  return responsiveSpacing[breakpoint][property] as string;
}

/**
 * Get grid column count for breakpoint
 * Usage: getGridColumns('md') // returns 3
 */
export function getGridColumns(breakpoint: keyof typeof gridColumns): number {
  return gridColumns[breakpoint];
}

/**
 * Generate CSS for responsive container
 */
export function getContainerCSS(): string {
  return `
    .container-responsive {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media (min-width: 640px) {
      .container-responsive {
        max-width: 640px;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    @media (min-width: 768px) {
      .container-responsive {
        max-width: 768px;
      }
    }

    @media (min-width: 1024px) {
      .container-responsive {
        max-width: 1024px;
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }

    @media (min-width: 1280px) {
      .container-responsive {
        max-width: 1280px;
      }
    }

    @media (min-width: 1536px) {
      .container-responsive {
        max-width: 1536px;
      }
    }
  `;
}

export default {
  breakpoints,
  breakpointNames,
  mediaQueries,
  containerSizes,
  responsiveSpacing,
  gridColumns,
  responsiveTypography,
  gridClasses,
  containerQueries,
  getResponsiveValue,
  getGridColumns,
  getContainerCSS,
};
