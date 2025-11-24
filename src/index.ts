import * as dotenv from 'dotenv';
dotenv.config();

// попередні функції
export function add(a: number, b: number): number {
  return a + b;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type NumberFormatOptions = {
  precision?: number;
  locale?: string;
};

export function formatNumber(value: number, options?: NumberFormatOptions): string {
  const precision = options?.precision ?? Number(process.env.APP_PRECISION ?? 2);
  return value.toFixed(precision);
}

// НОВЕ: інтерфейс і generic-функція
export interface User {
  id: number;
  name: string;
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const group = String(item[key]);
      acc[group] = acc[group] ?? [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
