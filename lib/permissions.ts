import type { Role } from './types';

export function requiredRole(pathname: string): Role | null {
  if (pathname.startsWith('/internal')) return 'internal';
  if (pathname.startsWith('/partner')) return 'partner';
  return null;
}

export function canAccessPath(pathname: string, role: Role | null, active = true) {
  const required = requiredRole(pathname);
  if (!required) return true;
  return !!role && active && role === required;
}
