/**
 * Escapes special regex characters in a string so it can be safely
 * used in a MongoDB $regex query without causing "invalid quantifier" errors.
 * Affects: . * + ? ^ $ { } ( ) | [ ] \
 */
export const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
