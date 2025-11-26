import config from '../../tailwind.config';

describe('Tailwind Theme Configuration - Design Tokens', () => {
  const theme = config.theme?.extend as any;

  describe('RED: Color palette', () => {
    test('primary color palette exists', () => {
      expect(theme?.colors?.primary).toBeDefined();
    });

    test('primary color has all shade levels (50-950)', () => {
      const primary = theme?.colors?.primary;
      const expectedShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
      expectedShades.forEach((shade) => {
        expect(primary?.[shade]).toBeDefined();
      });
    });

    test('semantic colors defined (success, warning, error)', () => {
      expect(theme?.colors?.success).toBeDefined();
      expect(theme?.colors?.warning).toBeDefined();
      expect(theme?.colors?.error).toBeDefined();
    });

    test('neutral/gray colors extended', () => {
      expect(theme?.colors?.neutral).toBeDefined();
    });
  });

  describe('RED: Typography scale', () => {
    test('fontSize configuration exists', () => {
      expect(theme?.fontSize).toBeDefined();
    });

    test('font sizes defined (xs, sm, base, lg, xl, 2xl+)', () => {
      const expectedSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
      const fontSize = theme?.fontSize;
      expectedSizes.forEach((size) => {
        expect(fontSize?.[size]).toBeDefined();
      });
    });

    test('font family includes Pretendard and Inter', () => {
      const fontFamily = theme?.fontFamily?.sans;
      expect(fontFamily?.toString()).toContain('Pretendard');
      expect(fontFamily?.toString()).toContain('Inter');
    });
  });

  describe('RED: Spacing system', () => {
    test('spacing utilities exist', () => {
      expect(theme?.spacing).toBeDefined();
    });

    test('spacing scale defined (xs, sm, md, lg, xl, 2xl)', () => {
      const expectedSpaces = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      const spacing = theme?.spacing;
      expectedSpaces.forEach((space) => {
        expect(spacing?.[space]).toBeDefined();
      });
    });
  });

  describe('RED: Shadow and border radius', () => {
    test('boxShadow extended for card elevations', () => {
      expect(theme?.boxShadow).toBeDefined();
    });

    test('borderRadius configured', () => {
      expect(theme?.borderRadius).toBeDefined();
    });
  });

  describe('RED: Transition and animation', () => {
    test('transition duration configured', () => {
      expect(theme?.transitionDuration).toBeDefined();
    });

    test('animation utilities exist for loading states', () => {
      expect(theme?.animation).toBeDefined();
    });
  });
});
