import "reflect-metadata";
import { ICreateOptions, IListenOptions, IStaticAssetOptions } from "@thunder-light/common/interfaces";
import { staticPlugin } from "@elysiajs/static";

import { IWebsocketAdapter, WebsocketConfig } from "../web-socket";
import { GraphQLConfig, IGraphQLAdapter } from "../graph-ql";
import { CronConfig, ICronAdapter } from "../cron";
import { RegisterManager } from "./register";

export class ThunderLightFactory extends RegisterManager {
  protected globalPrefix = "";

  static create(module: any, options?: ICreateOptions) {
    const factory = new ThunderLightFactory();
    if (options?.prefix) {
      factory.setGlobalPrefix(options.prefix);
    }
    factory.registerModule(module);
    return factory;
  }

  constructor() {
    super();
  }

  public setGlobalPrefix(prefix: string): this {
    this.globalPrefix = prefix;
    return this;
  }

  public useStaticAssets(
    options: IStaticAssetOptions = {
      assets: "public",
      prefix: "/public",
      ignorePatterns: [],
      staticLimit: 1024,
      alwaysStatic: false,
      headers: {},
    }
  ): void {
    this.use(staticPlugin(options));
  }

  public useWebSocketAdapter(adapter: IWebsocketAdapter, options?: WebsocketConfig): void {
    adapter.configureWebSocket(options);
    this.use(adapter.getRouter());
  }

  public useGraphQLAdapter(adapter: IGraphQLAdapter, options?: GraphQLConfig): void {
    adapter.configureGraphQL(options);
    this.use(adapter.getRouter());
  }

  public useCronAdapter(adapter: ICronAdapter, options?: CronConfig): void {
    adapter.configureCron(options);
    this.use(adapter.getRouter());
  }

  public useBullBoardAdapter(
    adapter: any,
    {
      queues = [],
      basePath,
      options,
    }: any
  ): void {
    if (basePath) {
      adapter.setBasePath(basePath);
      adapter.createBullBoard(
        {
          serverAdapter: adapter,
          queues: queues.map((bull: any) => new adapter(bull)),
          options,
        }
      )
    }
  }

  public async listening(options: IListenOptions): Promise<any> {
    await this.listen(options);
    console.log(`⚡️ ThunderLight is running on port ${this.server?.port}...`);
  }
}
