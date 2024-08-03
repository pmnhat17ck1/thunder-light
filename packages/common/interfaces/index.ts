import type {
    DefinitionBase,
    EphemeralType,
    HTTPMethod,
    InputSchema,
    LocalHook,
    MergeSchema,
    SingletonBase,
    UnwrapRoute,
  } from "elysia";
  
  export type BaseMacro = Record<
    string,
    Record<string, unknown> | ((...a: any) => unknown)
  >;
  
  export interface RouteSchema {
    body?: unknown;
    headers?: unknown;
    query?: unknown;
    params?: unknown;
    cookie?: unknown;
    response?: unknown;
  }
  
  export interface MetadataBase {
    schema: RouteSchema;
    macro: BaseMacro;
  }
  
  interface Container {
    get(identifier: string | symbol): Function;
  }
  
  interface Singleton extends SingletonBase {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
  }
  
  interface Definitions extends DefinitionBase {
    type: {};
    error: {};
  }
  
  interface Metadata extends MetadataBase {
    schema: {};
    macro: {};
  }
  
  interface Ephemeral extends EphemeralType {
    derive: {};
    resolve: {};
    schema: {};
  }
  
  interface Volatile extends EphemeralType {
    derive: {};
    resolve: {};
    schema: {};
  }
  
  interface LocalSchema extends InputSchema<keyof Definitions["type"] & string> {}
  interface Schema
    extends MergeSchema<
      UnwrapRoute<LocalSchema, Definitions["type"]>,
      Metadata["schema"] & Ephemeral["schema"] & Volatile["schema"]
    > {}
  
  interface Hook
    extends LocalHook<
      LocalSchema,
      Schema,
      Singleton & {
        derive: Ephemeral["derive"] & Volatile["derive"];
        resolve: Ephemeral["resolve"] & Volatile["resolve"];
      },
      Definitions["error"],
      Metadata["macro"],
      string
    > {}
  
  interface Config {
    config?: {
      allowMeta?: boolean;
    };
  }
  
  export interface RouteOptions extends Hook, Config {}
  
  export interface ElysiaRoute {
    method: HTTPMethod;
    path: string;
    methodName: string | symbol;
    options?: RouteOptions;
  }
  
  export interface IStaticAssetOptions {
    assets: string;
    prefix: string;
    ignorePatterns: string[];
    staticLimit: number;
    alwaysStatic: boolean;
    headers: Record<string, string>;
  }
  
  export interface IListenOptions {
    port: number;
    maxRequestBodySize?: any;
  }
  
  // Interface for module metadata
  export interface IModuleMetadata {
    imports?: any[];
    providers?: any[];
    controllers?: any[];
    exports?: any[];
  }
  
  // Interface for a provider
  export interface IProvider {
    new (...args: any[]): any;
  }
  
  // Interface for a controller
  export interface IController {
    new (...args: any[]): any;
  }
  
  // Interface for a controller method
  export interface IControllerMethod {
    (this: IController, ...args: any[]): any;
  }
  
  // Interface for a request parameter
  export interface IRequestParam {
    index: number;
    key?: string;
  }
  
  export interface ICreateOptions {
    prefix: string;
  }
  
  export interface Guard<T extends any[]> {
    canActivate: (context: any, next: Function) => Promise<boolean>;
  }
  
  export interface Interceptor<T extends any[]> {
    intercept: (context: any, next: Function) => Promise<any>;
  }
  













export * from './abstract.interface';
export * from './controllers/controller-metadata.interface';
export * from './controllers/controller.interface';
export * from './exceptions/exception-filter.interface';
export * from './exceptions/rpc-exception-filter.interface';
export * from './exceptions/ws-exception-filter.interface';
export * from './external/validation-error.interface';
export * from './features/arguments-host.interface';
export * from './features/can-activate.interface';
export * from './features/custom-route-param-factory.interface';
export * from './features/execution-context.interface';
export * from './features/nest-interceptor.interface';
export * from './features/paramtype.interface';
export * from './features/pipe-transform.interface';
export * from './global-prefix-options.interface';
export * from './hooks';
export * from './http';
export * from './injectable.interface';
export * from './microservices/nest-hybrid-application-options.interface';
export * from './middleware';
export * from './modules';
export * from './nest-application-context.interface';
export * from './nest-application-options.interface';
export * from './nest-application.interface';
export * from './nest-microservice.interface';
export * from './scope-options.interface';
export * from './type.interface';
export * from './version-options.interface';
export * from './websockets/web-socket-adapter.interface';
