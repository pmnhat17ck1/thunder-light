import "reflect-metadata";
import { GUARDS_KEY } from "@thunder-light/common/constants";
import type { Guard } from "@thunder-light/common/interfaces";

export function UseGuards(...guards: Guard<any>[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const existingGuards =
      Reflect.getMetadata(GUARDS_KEY, target, propertyKey) || [];
    Reflect.defineMetadata(
      GUARDS_KEY,
      [...existingGuards, ...guards],
      target,
      propertyKey
    );
    descriptor.value = async function (...args: any[]) {
      const next = async () => {
        return originalMethod.apply(this, args);
      };

      for (const guard of guards) {
        const canActivate = await guard.canActivate(this, next);
        if (!canActivate) {
          return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: {
              "Content-Type": "application/json",
            },
            status: 403,
          });
        }
      }
      return next();
    };
    return descriptor;
  };
}
