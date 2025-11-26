import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from '@/app/components/ui/Skeleton';

describe('Skeleton Component', () => {
  test('renders skeleton with default text variant', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('bg-neutral-200', 'animate-pulse', 'h-4', 'w-3/4');
  });

  test('renders text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('h-4', 'w-3/4');
  });

  test('renders card variant', () => {
    const { container } = render(<Skeleton variant="card" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('h-48', 'w-full', 'rounded-lg');
  });

  test('renders avatar variant', () => {
    const { container } = render(<Skeleton variant="avatar" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('h-12', 'w-12', 'rounded-full');
  });

  test('renders multiple skeletons with count', () => {
    const { container } = render(<Skeleton count={3} />);
    const skeletons = container.querySelectorAll('div');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  test('has pulse animation', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  test('accepts custom className', () => {
    const { container } = render(
      <Skeleton className="custom-class" />
    );
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('custom-class');
  });
});
