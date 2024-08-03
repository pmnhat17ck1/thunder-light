import { Elysia } from 'elysia';
import type { Context } from 'elysia';

import { healthCheckRegistry } from './registry';
import type { HealthCheckResult } from './types';

interface HealthCheckOptions {
  path?: string;
}

export const HealthCheck = (options: HealthCheckOptions = {}) => {
  const { path = '/health' } = options;

  return (app: Elysia) =>
    app.get(path, async ({ }: Context) => {
      const checks = healthCheckRegistry.getChecks();
      const results: Record<string, HealthCheckResult> = {};

      const promises = Array.from(checks.entries()).map(async ([name, check]) => {
        try {
          const result = await check();
          results[name] = result;
        } catch (error) {
          results[name] = { status: 'error', error };
        }
      });

      await Promise.all(promises);

      const overallStatus = Object.values(results).every(r => r.status === 'ok') ? 'ok' : 'error';
      return { status: overallStatus, info: results };
    });
};