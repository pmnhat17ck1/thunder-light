import "reflect-metadata";
import { MODULE_KEY } from "@thunder-light/common/constants";
import { IModuleMetadata } from "@thunder-light/common/interfaces";

export function Module(options: IModuleMetadata): ClassDecorator {
    return (target) => {
      Reflect.defineMetadata(MODULE_KEY, options, target);
    };
  }