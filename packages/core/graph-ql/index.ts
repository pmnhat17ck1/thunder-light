import Elysia from "elysia";
import { GraphQLConfig } from "./types";
import { apollo } from "@elysiajs/apollo";

export interface IGraphQLAdapter {
  configureGraphQL(config?: GraphQLConfig): void;
  getRouter(): Elysia;
}

export class GraphQLAdapter implements IGraphQLAdapter {
  private app: Elysia;

  constructor(app: Elysia) {
    this.app = app;
  }

  public configureGraphQL(config: GraphQLConfig): void {
    this.app.use(
      apollo({
        ...config,
        path: config?.path || "/graphql",
      })
    );
  }

  public getRouter(): Elysia {
    return this.app;
  }
}

export * from "./types";
