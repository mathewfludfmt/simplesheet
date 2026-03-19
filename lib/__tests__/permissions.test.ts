import { describe, expect, it } from 'vitest';
import { canAccessPath, requiredRole } from '@/lib/permissions';

describe('requiredRole', () => {
  it('maps route prefixes to roles', () => {
    expect(requiredRole('/internal/campaigns')).toBe('internal');
    expect(requiredRole('/partner/campaigns')).toBe('partner');
    expect(requiredRole('/login')).toBeNull();
  });
});

describe('canAccessPath', () => {
  it('blocks partners from internal pages and hides internal routes', () => {
    expect(canAccessPath('/internal/imports', 'partner')).toBe(false);
    expect(canAccessPath('/partner/campaigns', 'partner')).toBe(true);
    expect(canAccessPath('/partner/campaigns', 'internal')).toBe(false);
  });
});
