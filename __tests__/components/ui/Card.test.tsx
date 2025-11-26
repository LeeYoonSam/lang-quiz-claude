import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/Card';

describe('Card Component', () => {
  test('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('renders with default variant styles', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'p-6', 'shadow-sm');
  });

  test('renders with interactive variant', () => {
    const { container } = render(<Card variant="interactive">Interactive</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg');
  });

  test('accepts custom className', () => {
    const { container } = render(
      <Card className="custom-class">Custom</Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });
});

describe('CardHeader Component', () => {
  test('renders card header', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('CardTitle Component', () => {
  test('renders card title as h3', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByRole('heading', { level: 3, name: 'Title' });
    expect(title).toBeInTheDocument();
  });

  test('has correct styling', () => {
    const { container } = render(<CardTitle>Styled Title</CardTitle>);
    const title = container.querySelector('h3');
    expect(title).toHaveClass('text-xl', 'font-semibold', 'text-neutral-900');
  });
});

describe('CardDescription Component', () => {
  test('renders card description', () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });
});

describe('CardFooter Component', () => {
  test('renders card footer', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('has correct layout styles', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.querySelector('div');
    expect(footer).toHaveClass('flex', 'justify-between', 'items-center');
  });
});

describe('Card Composition', () => {
  test('renders complete card structure', () => {
    render(
      <Card variant="interactive">
        <CardHeader>
          <CardTitle>Word Set</CardTitle>
          <CardDescription>Learn new words</CardDescription>
        </CardHeader>
        <CardFooter>
          <span>25 words</span>
        </CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Word Set' })).toBeInTheDocument();
    expect(screen.getByText('Learn new words')).toBeInTheDocument();
    expect(screen.getByText('25 words')).toBeInTheDocument();
  });
});
