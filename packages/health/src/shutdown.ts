import { Elysia } from 'elysia';

interface ShutdownOptions {
  signals?: NodeJS.Signals[];
  timeout?: number;         
}

export const Shutdown = (options: ShutdownOptions = {}) => {
  const { signals = ['SIGINT', 'SIGTERM'], timeout = 10000 } = options;
  const shutdownHooks: (() => Promise<void> | void)[] = [];

  const handleSignal = async (signal: NodeJS.Signals) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    try {
      await Promise.allSettled(shutdownHooks.map(hook => hook()));
      console.log('Shutdown complete.');
      process.exit(0); 
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1); 
    }
  };

  return (app: Elysia) => {
    signals.forEach(signal => {
      process.on(signal, handleSignal);
    });

    return {
      addShutdownHook: (hook: () => Promise<void> | void) => {
        shutdownHooks.push(hook);
      },
    };
  };
};