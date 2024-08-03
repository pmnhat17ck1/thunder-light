import type { HealthCheckResult } from './types';

class HealthCheckRegistry {
  private checks: Map<string, () => Promise<HealthCheckResult> | HealthCheckResult> = new Map();

  register(name: string, check: () => Promise<HealthCheckResult> | HealthCheckResult) {
    this.checks.set(name, check);
  }

  getChecks() {
    return this.checks;
  }
}

export const healthCheckRegistry = new HealthCheckRegistry();