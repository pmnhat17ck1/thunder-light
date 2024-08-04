import "reflect-metadata";
import { IController, IProvider, IRequestParam } from "@thunder-light/common/interfaces";
import {
  ContextMetadataKeys,
  COOKIES_KEY,
  ERROR_KEY,
  HEADERS_KEY,
  PARAMS_KEY,
  PATH_KEY,
  QUERY_KEY,
  REDIRECT_KEY,
  REQ_KEY,
  RES_KEY,
  STORE_KEY,
  URL_KEY,
} from "@thunder-light/common/constants";
import Elysia, { Context } from "elysia";

export abstract class ExtractManager extends Elysia {
  protected providers = new Map<IProvider, any>();
  protected globalPrefix = "";

  constructor() {
    super();
  }

  private handleSend(value?: any) {
    return new Response(value)
  }

  private handleRender(value?: any, options?: any) {
    return new Response(value)
  }

  protected extractRequestParameters(
    ctx: Context,
    controller: IController,
    methodName: string
  ): any[] {
    const args: any[] = [];

    for (const key in ContextMetadataKeys) {
      if (Object.prototype.hasOwnProperty.call(ContextMetadataKeys, key)) {
        const metadataKey =
          ContextMetadataKeys[key as keyof typeof ContextMetadataKeys];
        const params: IRequestParam[] =
          Reflect.getMetadata(metadataKey, controller, methodName) || [];

        params.forEach((param: IRequestParam) => {
          switch (metadataKey) {
            case REQ_KEY:
              args[param.index] = ctx.request;
              break;
            case RES_KEY:
              args[param.index] = {
                ...ctx.set,
                send: this.handleSend,
                render: this.handleRender,
              };
              break;
            case PARAMS_KEY:
              args[param.index] = param.key
                ? ctx.params[param.key]
                : ctx.params;
              break;
            case QUERY_KEY:
              args[param.index] = param.key ? ctx.query[param.key] : ctx.query;
              break;
            case HEADERS_KEY:
              args[param.index] = param.key
                ? ctx.headers[param.key]
                : ctx.headers;
              break;
            case COOKIES_KEY:
              args[param.index] = param.key
                ? ctx.cookie[param.key]
                : ctx.cookie;
              break;
            case STORE_KEY:
              args[param.index] = param.key
                ? ctx.store[param.key as keyof typeof ctx.store]
                : ctx.store;
              break;
            case PATH_KEY:
              args[param.index] = ctx.path;
              break;
            case REDIRECT_KEY:
              args[param.index] = ctx.redirect;
              break;
            case ERROR_KEY:
              args[param.index] = ctx.error;
              break;
            case URL_KEY:
              args[param.index] = ctx.request.url;
              break;
            default:
              break;
          }
        });
      }
    }

    return args;
  }
}
