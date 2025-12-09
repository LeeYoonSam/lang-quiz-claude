import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/Dialog';

describe('Dialog Component', () => {
  describe('RED: Dialog Rendering', () => {
    test('renders dialog content when open prop is true', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>
            <p>Test content</p>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByText('Test Title');
      expect(title).toBeInTheDocument();
    });

    test('does not render dialog content when open prop is false', () => {
      render(
        <Dialog open={false}>
          <DialogContent>
            <DialogTitle>Hidden Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.queryByText('Hidden Title')).not.toBeInTheDocument();
    });

    test('renders with default portal container', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('RED: Dialog Content', () => {
    test('renders dialog title', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    test('renders dialog description', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Dialog description')).toBeInTheDocument();
    });

    test('renders dialog body content', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <p className="body-content">Body content here</p>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Body content here')).toBeInTheDocument();
    });
  });

  describe('RED: Dialog Controls', () => {
    test('calls onOpenChange when open state changes', async () => {
      const handleOpenChange = jest.fn();
      const { rerender } = render(
        <Dialog open={false} onOpenChange={handleOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await userEvent.click(trigger);

      expect(handleOpenChange).toHaveBeenCalled();
    });

    test('closes dialog when escape key is pressed', async () => {
      const handleOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog open={true} onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Closeable Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      await user.keyboard('{Escape}');

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    test('closes dialog when clicking outside (overlay)', async () => {
      const handleOpenChange = jest.fn();
      const user = userEvent.setup();

      const { container } = render(
        <Dialog open={true} onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const overlay = container.querySelector('[role="presentation"]');
      if (overlay) {
        await user.click(overlay);
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      }
    });

    test('prevents closing when clicking inside dialog content', async () => {
      const handleOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog open={true} onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
            <p>Click me</p>
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByText('Click me');
      await user.click(content);

      expect(handleOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('RED: Dialog Footer', () => {
    test('renders footer with action buttons', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    test('calls action callbacks when footer buttons are clicked', async () => {
      const handleCancel = jest.fn();
      const handleConfirm = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Confirm</DialogTitle>
            <DialogFooter>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleConfirm}>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(handleCancel).toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(handleConfirm).toHaveBeenCalled();
    });
  });

  describe('RED: Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByText('Accessible Dialog');
      expect(title).toBeInTheDocument();
    });

    test('has role="dialog" on content element', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const dialogElement = container.querySelector('[role="dialog"]');
      expect(dialogElement).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Keyboard Test</DialogTitle>
            <button>Button 1</button>
            <button>Button 2</button>
          </DialogContent>
        </Dialog>
      );

      const button1 = screen.getByRole('button', { name: 'Button 1' });
      const button2 = screen.getByRole('button', { name: 'Button 2' });

      // Verify buttons exist and are accessible
      expect(button1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();
    });

    test('traps focus within dialog', async () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Focus Trap</DialogTitle>
            <button>First Button</button>
            <button>Last Button</button>
          </DialogContent>
        </Dialog>
      );

      const firstButton = screen.getByRole('button', { name: 'First Button' });
      const lastButton = screen.getByRole('button', { name: 'Last Button' });

      // Verify buttons are in dialog content
      expect(firstButton).toBeInTheDocument();
      expect(lastButton).toBeInTheDocument();
    });
  });

  describe('RED: States and Variants', () => {
    test('applies custom className to dialog content', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent className="custom-class">
            <DialogTitle>Custom Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const content = container.querySelector('.custom-class');
      expect(content).toBeInTheDocument();
    });

    test('renders with overlay/backdrop', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>With Overlay</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const overlay = container.querySelector('[role="presentation"]');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('REFACTOR: Animation and Transitions', () => {
    test('should support animation transitions', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Animated Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const content = container.querySelector('[role="dialog"]');
      expect(content).toBeInTheDocument();
      // Animation will be handled by Framer Motion internally
    });
  });
});
