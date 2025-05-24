// src/utils/durationParser.test.ts
import { describe, it, expect } from 'vitest';
import { parseDurationToMs } from './durationParser'; // Corrected import name

describe('Duration Parser', () => {
  it('should parse seconds correctly', () => {
    expect(parseDurationToMs('30s')).toBe(30 * 1000);
    expect(parseDurationToMs('1s')).toBe(1000);
  });

  it('should parse minutes correctly', () => {
    expect(parseDurationToMs('5m')).toBe(5 * 60 * 1000);
    expect(parseDurationToMs('1m')).toBe(60 * 1000);
  });

  it('should parse hours correctly', () => {
    expect(parseDurationToMs('2h')).toBe(2 * 60 * 60 * 1000);
    expect(parseDurationToMs('1h')).toBe(60 * 60 * 1000);
  });

  it('should parse days correctly', () => {
    expect(parseDurationToMs('3d')).toBe(3 * 24 * 60 * 60 * 1000);
    expect(parseDurationToMs('1d')).toBe(24 * 60 * 60 * 1000);
  });

  it('should parse combined durations correctly', () => {
    expect(parseDurationToMs('1h 30m')).toBe((1 * 60 * 60 + 30 * 60) * 1000);
    expect(parseDurationToMs('2d 5h 10s')).toBe((2 * 24 * 60 * 60 + 5 * 60 * 60 + 10) * 1000);
  });

  it('should handle whitespace variations', () => {
    expect(parseDurationToMs(' 1h  30m ')).toBe((1 * 60 * 60 + 30 * 60) * 1000);
    expect(parseDurationToMs('5m30s')).toBe((5 * 60 + 30) * 1000); // No space
  });

  it('should return 0 for invalid or empty input', () => {
    expect(parseDurationToMs('')).toBe(0);
    expect(parseDurationToMs(' ')).toBe(0);
    expect(parseDurationToMs('invalid')).toBe(0);
    expect(parseDurationToMs('10x')).toBe(0);
    expect(parseDurationToMs('1 hour')).toBe(0); // Requires 'h' suffix
  });

  it('should handle large numbers', () => {
     expect(parseDurationToMs('365d')).toBe(365 * 24 * 60 * 60 * 1000);
  });
});
