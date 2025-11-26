import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/app/components/ui/Input';

describe('Input Component', () => {
  test('renders input element', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<Input label="Name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  test('shows required indicator', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('accepts input value', async () => {
    const user = userEvent.setup();
    const { container } = render(<Input defaultValue="test" onChange={() => {}} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  test('renders error message', () => {
    render(<Input label="Password" error="Password is required" />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('sets aria-invalid when error exists', () => {
    const { container } = render(<Input error="Error message" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('has error styling when error exists', () => {
    const { container } = render(<Input error="Error" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-error-500', 'focus:ring-error-500');
  });

  test('renders helper text without error', () => {
    render(<Input helperText="Help text" />);
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  test('does not show helper text when error exists', () => {
    const { queryByText } = render(
      <Input helperText="Helper" error="Error" />
    );
    expect(queryByText('Helper')).not.toBeInTheDocument();
    expect(queryByText('Error')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    const { container } = render(
      <Input label="Email" error="Invalid email" />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('handles different input types', () => {
    const { container } = render(<Input type="email" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'email');
  });
});
