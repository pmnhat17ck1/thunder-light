import Elysia from "elysia";
import { CronConfig } from "./types";
import { cron } from "@elysiajs/cron";

export interface ICronAdapter {
  configureCron(config?: CronConfig): void;
  getRouter(): Elysia;
}

export class CronAdapter implements ICronAdapter {
  private app: Elysia;

  constructor(app: Elysia) {
    this.app = app;
  }

  public configureCron(config?: CronConfig): void {
    if (config?.crons) {
      config.crons.forEach((item) => {
        this.app.use(cron(item));
      });
    }
  }

  public getRouter(): Elysia {
    return this.app;
  }
}

export * from "./types";
