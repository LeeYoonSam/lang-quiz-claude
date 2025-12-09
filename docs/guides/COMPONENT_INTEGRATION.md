# Component Integration Guide (SPEC-UI-001)

> Practical guide to using and integrating design system components in your application.

**Last Updated**: 2025-12-06 | **Version**: 1.0.0

## Table of Contents

1. [Overview](#overview)
2. [Button Component](#button-component)
3. [Card Component](#card-component)
4. [Input Component](#input-component)
5. [Badge Component](#badge-component)
6. [Dialog Component](#dialog-component)
7. [Grid Component](#grid-component)
8. [Skeleton Component](#skeleton-component)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

## Overview

This guide provides practical examples for integrating design system components into your pages and features. Each component is located in `/app/components/ui/` and designed to be composable and accessible.

### Import Syntax

All components follow the same import pattern:

```typescript
import { ComponentName } from '@/app/components/ui/ComponentName';
```

### Design Principles

- **Composable**: Components combine seamlessly
- **Accessible**: WCAG 2.1 AA compliant by default
- **Responsive**: Mobile-first with responsive utilities
- **Customizable**: Accept className props for extensions

## Button Component

The Button component provides interactive triggers with multiple variants and states.

### Location
`/app/components/ui/Button.tsx`

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
```

### Variants

**Primary** - Main call-to-action buttons
```tsx
<Button variant="primary">Save Changes</Button>
// Output: bg-primary-600 text-white hover:bg-primary-700
```

**Secondary** - Alternative actions
```tsx
<Button variant="secondary">Cancel</Button>
// Output: bg-neutral-600 text-white hover:bg-neutral-700
```

**Outline** - Secondary emphasis
```tsx
<Button variant="outline">Edit</Button>
// Output: border-2 border-primary-600 text-primary-600 hover:bg-primary-50
```

**Ghost** - Minimal emphasis
```tsx
<Button variant="ghost">Learn More</Button>
// Output: text-primary-600 hover:bg-primary-50
```

### Sizes

```tsx
<Button size="sm">Small</Button>      {/* px-3 py-1 text-sm */}
<Button size="md">Medium</Button>    {/* px-4 py-2 text-base (default) */}
<Button size="lg">Large</Button>     {/* px-6 py-3 text-lg */}
```

### States and Loading

```tsx
{/* Disabled state */}
<Button disabled>Save</Button>

{/* Loading state */}
<Button loading>Processing...</Button>

{/* Combined */}
<Button disabled={isSubmitting} loading={isSubmitting}>
  {isSubmitting ? 'Saving' : 'Save'}
</Button>
```

### Real-world Example: Word Set Form

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

export default function WordSetForm() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/wordsets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: '' })
      });

      if (response.ok) {
        setName('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Word Set Name"
        placeholder="e.g., TOEFL Vocabulary"
        value={name}
        onChange={setName}
        required
      />

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={!name.trim()}
        >
          Create Set
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

## Card Component

The Card component provides containers for content with interactive and static variants.

### Location
`/app/components/ui/Card.tsx`

### Props

```typescript
interface CardProps {
  variant?: 'default' | 'interactive';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
```

### Variants

**Default** - Static content container
```tsx
<Card>
  <div className="p-6">
    <h3 className="text-lg font-semibold">Static Content</h3>
  </div>
</Card>
```

**Interactive** - Clickable, hoverable cards
```tsx
<Card
  variant="interactive"
  onClick={() => navigate(`/wordsets/${id}`)}
>
  <div className="p-6">
    <h3 className="text-lg font-semibold">Clickable Card</h3>
  </div>
</Card>
```

### Composition Example: WordSet Card

```tsx
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { useRouter } from 'next/navigation';

interface WordSetCardProps {
  id: string;
  name: string;
  description?: string;
  wordCount: number;
  createdAt: Date;
}

export function WordSetCard({
  id,
  name,
  description,
  wordCount,
  createdAt
}: WordSetCardProps) {
  const router = useRouter();

  return (
    <Card
      variant="interactive"
      onClick={() => router.push(`/wordsets/${id}`)}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-neutral-900">
            {name}
          </h3>
          {description && (
            <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <Badge variant="secondary">
            {wordCount} words
          </Badge>
          <span className="text-xs text-neutral-500">
            {createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}

// Usage
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {wordsets.map(ws => (
    <WordSetCard key={ws.id} {...ws} />
  ))}
</div>
```

## Input Component

The Input component provides form inputs with validation, error handling, and accessibility.

### Location
`/app/components/ui/Input.tsx`

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

### Basic Usage

```tsx
import { Input } from '@/app/components/ui/Input';
import { useState } from 'react';

export default function FormExample() {
  const [email, setEmail] = useState('');

  return (
    <Input
      label="Email Address"
      type="email"
      placeholder="user@example.com"
      value={email}
      onChange={setEmail}
      required
    />
  );
}
```

### With Validation

```tsx
import { Input } from '@/app/components/ui/Input';
import { useState } from 'react';

export default function ValidatedForm() {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (value: string) => {
    setName(value);
    // Clear error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    console.log('Valid name:', name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChange={handleChange}
        error={errors.name}
        helperText="Your name will appear on certificates"
        required
      />

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
```

### Input Variants

```tsx
{/* Text input */}
<Input label="Username" type="text" value={value} onChange={setValue} />

{/* Email input */}
<Input label="Email" type="email" value={value} onChange={setValue} />

{/* Password input */}
<Input label="Password" type="password" value={value} onChange={setValue} />

{/* With error state */}
<Input
  label="Word"
  value={value}
  onChange={setValue}
  error="This word already exists"
/>

{/* With helper text */}
<Input
  label="Description"
  value={value}
  onChange={setValue}
  helperText="Maximum 200 characters"
/>

{/* Disabled */}
<Input
  label="ID"
  value={id}
  onChange={setValue}
  disabled
/>
```

## Badge Component

The Badge component displays status indicators and tags.

### Location
`/app/components/ui/Badge.tsx`

### Props

```typescript
interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}
```

### Variants

```tsx
{/* Primary */}
<Badge variant="primary">Feature</Badge>

{/* Secondary (default) */}
<Badge>Tag</Badge>

{/* Success */}
<Badge variant="success">Completed</Badge>

{/* Warning */}
<Badge variant="warning">In Progress</Badge>

{/* Error */}
<Badge variant="error">Failed</Badge>
```

### Real-world Example: Status Indicators

```tsx
function WordSetListItem({ status, wordCount }) {
  const statusBadgeVariant = {
    'active': 'primary',
    'completed': 'success',
    'archived': 'secondary',
    'error': 'error'
  }[status];

  return (
    <div className="flex items-center gap-4">
      <span className="flex-1">{name}</span>

      <Badge variant={statusBadgeVariant}>
        {status}
      </Badge>

      <Badge>
        {wordCount} words
      </Badge>
    </div>
  );
}
```

## Dialog Component

The Dialog component provides modal dialogs for confirmations and user interactions.

### Location
`/app/components/ui/Dialog.tsx`

### Props

```typescript
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
```

### Confirmation Dialog Example

```tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@/app/components/ui/Dialog';
import { Button } from '@/app/components/ui/Button';

export default function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/wordsets/${id}`, { method: 'DELETE' });
      setIsOpen(false);
      // Refresh list
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        Delete Set
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Word Set?"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            This action cannot be undone. All words in this set will be deleted.
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
```

## Grid Component

The Grid component provides responsive column layouts.

### Location
`/app/components/ui/Grid.tsx`

### Props

```typescript
interface GridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

### Basic Grid

```tsx
import { Grid } from '@/app/components/ui/Grid';

<Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  {items.map(item => (
    <Card key={item.id}>{/* ... */}</Card>
  ))}
</Grid>
```

### Responsive Grid Example

```tsx
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {wordsets.map(ws => (
    <WordSetCard key={ws.id} {...ws} />
  ))}
</div>

{/* Mobile: 1 column, Tablet: 3 columns, Desktop: 4 columns */}
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {folders.map(folder => (
    <FolderCard key={folder.id} {...folder} />
  ))}
</div>
```

## Skeleton Component

The Skeleton component displays loading state placeholders.

### Location
`/app/components/ui/Skeleton.tsx`

### Props

```typescript
interface SkeletonProps {
  variant?: 'card' | 'text' | 'circle';
  count?: number;
  className?: string;
}
```

### Loading State Pattern

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { WordSetCard } from './WordSetCard';
import { Skeleton } from '@/app/components/ui/Skeleton';

export default function WordSetList() {
  const { data: wordsets, isLoading } = useQuery({
    queryKey: ['wordsets'],
    queryFn: async () => {
      const res = await fetch('/api/wordsets');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wordsets.map(ws => (
        <WordSetCard key={ws.id} {...ws} />
      ))}
    </div>
  );
}
```

## Common Patterns

### Form Layout Pattern

```tsx
<form className="space-y-6 max-w-md">
  <Input
    label="Field 1"
    value={field1}
    onChange={setField1}
    error={errors.field1}
  />

  <Input
    label="Field 2"
    value={field2}
    onChange={setField2}
    error={errors.field2}
  />

  <div className="flex gap-3 pt-4">
    <Button type="submit" variant="primary">
      Submit
    </Button>
    <Button type="button" variant="outline">
      Cancel
    </Button>
  </div>
</form>
```

### List with Actions Pattern

```tsx
<div className="space-y-3">
  {items.map(item => (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
    >
      <div>
        <h4 className="font-medium text-neutral-900">{item.name}</h4>
        <p className="text-sm text-neutral-600">{item.description}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(item)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(item)}
        >
          Delete
        </Button>
      </div>
    </div>
  ))}
</div>
```

## Troubleshooting

### Button styles not applied

**Issue**: Button variant styles not showing
**Solution**: Ensure Tailwind CSS is properly configured. Check that the design system is built before running the dev server.

### Input validation error not displaying

**Issue**: Error message not visible
**Solution**: Ensure the `error` prop is passed to the Input component. Check that helper text styling is correct.

### Card hover effects not working

**Issue**: Interactive card hover effect not visible
**Solution**: Use `variant="interactive"` on Card component. Ensure `onClick` handler is provided.

### z-index stacking issues

**Issue**: Dialog appearing behind other elements
**Solution**: Check z-index values. Dialog component should have `z-50`, ensure no parent elements have higher z-index.

---

**Document Status**: Complete | **Last Reviewed**: 2025-12-06 | **Version**: 1.0.0
