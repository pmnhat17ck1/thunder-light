export interface HealthCheckResult {
    status: 'ok' | 'error';
    info?: Record<string, any>;
    error?: any;
  }