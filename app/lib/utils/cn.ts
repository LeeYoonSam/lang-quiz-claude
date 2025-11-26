import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with conflict resolution
 * Combines clsx (conditional classes) with tailwind-merge (resolve conflicts)
 *
 * @example
 * cn('px-2', 'py-3') // 'px-2 py-3'
 * cn('p-2', 'p-4') // 'p-4' (tailwind-merge resolves conflict)
 * cn('base', isActive && 'active') // 'base active' (if isActive is true)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
