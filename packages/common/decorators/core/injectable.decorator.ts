import "reflect-metadata";
import { INJECTABLE_KEY, SCOPE_OPTIONS_KEY } from "@thunder-light/common/constants";
import { RouteOptions } from "@thunder-light/common/interfaces";

export function Injectable(options?: RouteOptions): ClassDecorator {
    return (target) => {
      Reflect.defineMetadata(INJECTABLE_KEY, true, target);
      Reflect.defineMetadata(SCOPE_OPTIONS_KEY, options, target);
    };
  }