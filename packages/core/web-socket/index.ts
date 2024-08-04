import Elysia from "elysia";
import { WebsocketConfig } from "./types";

export interface IWebsocketAdapter {
  configureWebSocket(config?: WebsocketConfig): void;
  getRouter(): Elysia;
}

export class WebsocketAdapter implements IWebsocketAdapter {
  private readonly app: Elysia;

  constructor(app: Elysia) {
    this.app = app;
  }

  public configureWebSocket(
    config: WebsocketConfig = {
      idleTimeout: 120,
      perMessageDeflate: false,
      backpressureLimit: 16777216,
      closeOnBackpressureLimit: false,
      maxPayloadLength: 16 * 1024 * 1024,
    }
  ): void {
    this.app.config.websocket = {
      ...this.app.config.websocket,
      ...config,
    };
  }

  public getRouter(): Elysia {
    return this.app;
  }
}

export * from "./types";
