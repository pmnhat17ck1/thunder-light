import "reflect-metadata";
import { INTERCEPTORS_KEY } from "../constants/decorators.constant";
import type { Interceptor } from "../interfaces";

export function UseInterceptors(...interceptors: Interceptor<any>[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const existingInterceptors =
      Reflect.getMetadata(INTERCEPTORS_KEY, target, propertyKey) || [];
    Reflect.defineMetadata(
      INTERCEPTORS_KEY,
      [...existingInterceptors, ...interceptors],
      target,
      propertyKey
    );
    descriptor.value = async function (...args: any[]) {
      const next = async () => {
        return originalMethod.apply(this, args);
      };

      for (const interceptor of interceptors) {
        const result = await interceptor.intercept(this, next);
        if (result !== undefined) {
          return result;
        }
      }
      return next();
    };
    return descriptor;
  };
}
