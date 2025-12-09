'use client';

import React from 'react';
import { cn } from '@/app/lib/utils/cn';

type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns on mobile (default: 1)
   */
  cols?: GridColumns;

  /**
   * Number of columns on small screens (640px+)
   */
  smCols?: GridColumns;

  /**
   * Number of columns on medium screens (768px+)
   */
  mdCols?: GridColumns;

  /**
   * Number of columns on large screens (1024px+)
   */
  lgCols?: GridColumns;

  /**
   * Number of columns on extra-large screens (1280px+)
   */
  xlCols?: GridColumns;

  /**
   * Gap between grid items (default: 4)
   * Uses Tailwind spacing scale (2, 3, 4, 6, 8, etc.)
   */
  gap?: 1 | 2 | 3 | 4 | 6 | 8;

  /**
   * Responsive gap: different on mobile vs larger screens
   */
  responsiveGap?: boolean;

  children: React.ReactNode;
}

const gridColsMap: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const gapMap: Record<number, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

/**
 * Responsive Grid Component
 * Provides mobile-first grid layouts with customizable column counts
 *
 * AC-9: Mobile-first grid (1/2/3 column layouts)
 * AC-10: Responsive breakpoints (sm, md, lg, xl, 2xl)
 *
 * @example
 * // 1 column on mobile, 2 on tablet, 3 on desktop
 * <Grid cols={1} mdCols={2} lgCols={3} gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 */
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = 1,
      smCols,
      mdCols,
      lgCols,
      xlCols,
      gap = 4,
      responsiveGap = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseGridClass = gridColsMap[cols];
    const smGridClass = smCols ? `sm:${gridColsMap[smCols]}` : '';
    const mdGridClass = mdCols ? `md:${gridColsMap[mdCols]}` : '';
    const lgGridClass = lgCols ? `lg:${gridColsMap[lgCols]}` : '';
    const xlGridClass = xlCols ? `xl:${gridColsMap[xlCols]}` : '';

    const gapClass = gapMap[gap];
    const responsiveGapClass = responsiveGap ? 'md:gap-6' : '';

    const classes = cn(
      'grid',
      baseGridClass,
      smGridClass,
      mdGridClass,
      lgGridClass,
      xlGridClass,
      gapClass,
      responsiveGapClass,
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Max width of container (default: 7xl for 1280px)
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';

  /**
   * Enable responsive padding (default: true)
   */
  responsivePadding?: boolean;

  children: React.ReactNode;
}

const maxWidthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
};

/**
 * Responsive Container Component
 * Limits content width and provides responsive padding
 *
 * @example
 * <Container maxWidth="7xl">
 *   <h1>Content with constrained width</h1>
 * </Container>
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = '7xl',
      responsivePadding = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const maxWidthClass = maxWidthMap[maxWidth] || maxWidthMap['7xl'];
    const paddingClass = responsivePadding ? 'px-4 md:px-8' : '';

    const classes = cn(
      'w-full mx-auto',
      maxWidthClass,
      paddingClass,
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Stack direction: column (default) or row
   */
  direction?: 'row' | 'col';

  /**
   * Responsive: stack on mobile, row on larger screens
   */
  responsive?: boolean;

  /**
   * Gap between stack items
   */
  gap?: 1 | 2 | 3 | 4 | 6 | 8;

  children: React.ReactNode;
}

/**
 * Stack Component
 * Provides flexbox-based layouts for stacking items
 *
 * @example
 * // Stacks vertically on mobile, horizontally on md+
 * <Stack responsive direction="row" gap={4}>
 *   <button>Action 1</button>
 *   <button>Action 2</button>
 * </Stack>
 */
const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'col',
      responsive = false,
      gap = 4,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const directionClass = responsive
      ? direction === 'row'
        ? 'flex flex-col md:flex-row'
        : 'flex flex-row md:flex-col'
      : direction === 'row'
        ? 'flex flex-row'
        : 'flex flex-col';

    const gapClass = gapMap[gap];

    const classes = cn(directionClass, gapClass, className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export { Grid, Container, Stack };
