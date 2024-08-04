import "reflect-metadata";
import { CONTROLLER_KEY, SCOPE_OPTIONS_KEY } from "@thunder-light/common/constants";
import { RouteOptions } from "@thunder-light/common/interfaces";


export function Controller(prefix: string, options?: RouteOptions): ClassDecorator {
    return (target) => {
      Reflect.defineMetadata(CONTROLLER_KEY, prefix, target);
      Reflect.defineMetadata(SCOPE_OPTIONS_KEY, options, target);
    };
  }
  