import "reflect-metadata";
import {
  CONTROLLER_KEY,
  INJECTABLE_KEY,
  MODULE_KEY,
} from "../constants/decorators.constant";

export function Controller(prefix: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_KEY, prefix, target);
  };
}

export function Module(options: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
  exports?: any[];
}): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_KEY, options, target);
  };
}

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
  };
}
