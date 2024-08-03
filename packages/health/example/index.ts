import { Elysia } from 'elysia';
// @ts-ignore
import { HealthCheck, Shutdown, healthCheckRegistry } from 'thunder-light/terminus';

const app = new Elysia();

const { addShutdownHook } = app.use(Shutdown());

app.use(HealthCheck());

healthCheckRegistry.register('database', async () => ({
  status: 'ok',
  info: { database: 'connected' },
}));

addShutdownHook(async () => {
  // Logic to close database
  console.log('Closing database connection...');
});

app.listen(3000);