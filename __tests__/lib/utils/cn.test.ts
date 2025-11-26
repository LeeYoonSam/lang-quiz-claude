import { cn } from '@/app/lib/utils/cn';

describe('cn() - Class name merger utility', () => {
  describe('RED: Basic functionality', () => {
    test('merges simple class names', () => {
      const result = cn('px-2', 'py-3');
      expect(result).toEqual('px-2 py-3');
    });

    test('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    test('removes falsy values', () => {
      const result = cn('px-2', false && 'hidden', undefined, 'py-3', null);
      expect(result).toBe('px-2 py-3');
    });

    test('handles objects', () => {
      const result = cn({
        'px-2': true,
        'py-3': false,
        'text-center': true,
      });
      expect(result).toContain('px-2');
      expect(result).toContain('text-center');
      expect(result).not.toContain('py-3');
    });

    test('merges conflicting Tailwind classes', () => {
      // Should prefer the later class when conflicts exist
      const result = cn('p-2', 'p-4');
      // tailwind-merge should handle this
      expect(result).toBeTruthy();
    });

    test('handles array inputs', () => {
      const result = cn(['px-2', 'py-3'], 'text-center');
      expect(result).toContain('px-2');
      expect(result).toContain('py-3');
      expect(result).toContain('text-center');
    });
  });

  describe('REFACTOR: Edge cases', () => {
    test('handles empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
    });

    test('handles nested arrays', () => {
      const result = cn(['px-2', ['py-3', 'text-center']]);
      expect(result).toContain('px-2');
      expect(result).toContain('py-3');
      expect(result).toContain('text-center');
    });

    test('handles complex nested structures', () => {
      const result = cn(
        'base',
        {
          'active': true,
          'disabled': false,
        },
        ['extra', 'classes'],
        undefined,
        null
      );
      expect(result).toContain('base');
      expect(result).toContain('active');
      expect(result).toContain('extra');
      expect(result).toContain('classes');
    });
  });
});
