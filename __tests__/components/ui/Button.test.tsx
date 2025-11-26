import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/app/components/ui/Button';

describe('Button Component', () => {
  describe('RED: Basic rendering', () => {
    test('renders button with text', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
    });

    test('renders with primary variant by default', () => {
      render(<Button>Save</Button>);
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toHaveClass('bg-primary-600');
    });

    test('renders with md size by default', () => {
      render(<Button>Action</Button>);
      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toHaveClass('px-4', 'py-2');
    });
  });

  describe('RED: Variants', () => {
    test('renders primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button', { name: 'Primary' });
      expect(button).toHaveClass('bg-primary-600', 'text-white');
    });

    test('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button).toHaveClass('bg-neutral-600', 'text-white');
    });

    test('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button', { name: 'Outline' });
      expect(button).toHaveClass('border-2', 'border-primary-600', 'text-primary-600');
    });

    test('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button', { name: 'Ghost' });
      expect(button).toHaveClass('text-primary-600');
    });
  });

  describe('RED: Sizes', () => {
    test('renders sm size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button', { name: 'Small' });
      expect(button).toHaveClass('px-3', 'py-1');
    });

    test('renders md size', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button', { name: 'Medium' });
      expect(button).toHaveClass('px-4', 'py-2');
    });

    test('renders lg size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button', { name: 'Large' });
      expect(button).toHaveClass('px-6', 'py-3');
    });
  });

  describe('RED: States', () => {
    test('renders disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    test('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button', { name: 'Click' });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not trigger click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Disabled' });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('RED: Loading state', () => {
    test('renders loading state with spinner', () => {
      render(<Button loading>Saving...</Button>);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    test('disables button in loading state', () => {
      render(<Button loading>Saving...</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('RED: Accessibility', () => {
    test('has accessible button role', () => {
      render(<Button>Accessible</Button>);
      const button = screen.getByRole('button', { name: 'Accessible' });
      expect(button).toHaveProperty('type', 'button');
    });

    test('supports aria-label', () => {
      render(<Button aria-label="Save document">Save</Button>);
      const button = screen.getByLabelText('Save document');
      expect(button).toBeInTheDocument();
    });

    test('has visible focus indicator', async () => {
      const user = userEvent.setup();
      render(<Button>Focus</Button>);
      const button = screen.getByRole('button', { name: 'Focus' });

      await user.tab();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-offset-2');
    });
  });

  describe('REFACTOR: Custom classes', () => {
    test('accepts custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button', { name: 'Custom' });
      expect(button).toHaveClass('custom-class');
    });

    test('merges custom classes with variant classes', () => {
      render(
        <Button variant="primary" className="w-full">
          Full Width
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Full Width' });
      expect(button).toHaveClass('bg-primary-600', 'w-full');
    });
  });
});
