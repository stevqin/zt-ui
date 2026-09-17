import { describe, expect, it } from 'vitest';
import {
  componentGroups,
  componentPlan,
  components,
  foundations,
  roadmapPhases,
} from './catalog';
import { searchDocs } from './search';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('documentation information architecture', () => {
  it('organizes the system into eight durable capability groups', () => {
    expect(componentGroups.map((group) => group.id)).toEqual([
      'foundation',
      'layout',
      'form',
      'data',
      'navigation',
      'feedback',
      'overlay',
      'media',
    ]);
    expect(new Set(componentGroups.map((group) => group.title)).size).toBe(8);
  });

  it('assigns every stable component to one known group and a unique route', () => {
    const groupIds = new Set(componentGroups.map((group) => group.id));
    expect(new Set(components.map((component) => component.path)).size).toBe(
      components.length,
    );
    for (const component of components) {
      expect(groupIds.has(component.group), component.name).toBe(true);
      expect(component.status).toBe('stable');
      expect(component.description.length, component.name).toBeGreaterThan(8);
    }
  });

  it('keeps planned components out of demo routes and gives each one a phase', () => {
    const stableNames = new Set(components.map((component) => component.name));
    const phaseIds = new Set(roadmapPhases.map((phase) => phase.id));
    expect(Array.isArray(componentPlan)).toBe(true);
    for (const item of componentPlan) {
      expect(stableNames.has(item.name), item.name).toBe(false);
      expect(phaseIds.has(item.phase), item.name).toBe(true);
      expect(item.description.length, item.name).toBeGreaterThan(8);
    }
  });

  it('defines the foundation reading path', () => {
    expect(foundations.map((item) => item.id)).toEqual([
      'theme',
      'density',
      'radius',
      'status',
      'accessibility',
      'responsive',
    ]);
  });

  it('makes delivered roadmap components discoverable on their live pages', () => {
    expect(
      searchDocs('Skeleton').some((result) => result.path === '/skeleton'),
    ).toBe(true);
    expect(components.some((component) => component.name === 'Skeleton')).toBe(
      true,
    );
  });

  it('uses component pages as the only component detail route', () => {
    const routes = readFileSync(
      resolve(process.cwd(), 'src/router/index.ts'),
      'utf8',
    );
    expect(routes).not.toContain("path: '/api/:component");
    expect(routes).toContain("path: '/api'");
  });
});
