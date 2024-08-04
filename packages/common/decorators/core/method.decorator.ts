import "reflect-metadata";
import {
  METHOD_KEY,
  SCOPE_OPTIONS_KEY,
  ROUTE_KEY,
} from "@thunder-light/common/constants";
import type { RouteOptions } from "@thunder-light/common/interfaces";

function Route(
  method: string,
  route: string,
  options?: RouteOptions
): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(METHOD_KEY, method, target, propertyKey as string);
    Reflect.defineMetadata(ROUTE_KEY, route, target, propertyKey as string);
    Reflect.defineMetadata(SCOPE_OPTIONS_KEY, options, target, propertyKey as string);
  };
}

export function Get(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("get", route, options);
}

export function Post(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("post", route, options);
}

export function Put(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("put", route, options);
}

export function Patch(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("patch", route, options);
}

export function Delete(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("delete", route, options);
}

export function Head(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("head", route, options);
}

export function WS(
  route: string = "/",
  options?: RouteOptions
): MethodDecorator {
  return Route("ws", route, options);
}
