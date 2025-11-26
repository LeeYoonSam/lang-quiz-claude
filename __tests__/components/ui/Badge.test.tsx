import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/app/components/ui/Badge';

describe('Badge Component', () => {
  test('renders badge with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('renders with primary variant by default', () => {
    const { container } = render(<Badge>Primary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
  });

  test('renders with md size by default', () => {
    const { container } = render(<Badge>Medium</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  test('renders secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-neutral-100', 'text-neutral-800');
  });

  test('renders success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-success-100', 'text-success-800');
  });

  test('renders warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-warning-100', 'text-warning-800');
  });

  test('renders error variant', () => {
    const { container } = render(<Badge variant="error">Error</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-error-100', 'text-error-800');
  });

  test('renders sm size', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
  });

  test('accepts custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>
    );
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom-class');
  });
});
