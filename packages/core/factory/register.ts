import "reflect-metadata";
import { IModuleMetadata, IProvider, IController } from "@thunder-light/common/interfaces";
import { CONTROLLER_KEY, GUARDS_KEY, INTERCEPTORS_KEY, METHOD_KEY, MODULE_KEY, SCOPE_OPTIONS_KEY, ROUTE_KEY } from "@thunder-light/common/constants";
import { ResolveManager } from "./resolve";
import { Context } from "elysia";

export class RegisterManager extends ResolveManager {
  protected providers = new Map<IProvider, any>();
  protected globalPrefix = "";

  constructor() {
    super();
  }
  
  public registerModule(module: any): void {
    const moduleMetadata: IModuleMetadata =
      Reflect.getMetadata(MODULE_KEY, module) || {};

    moduleMetadata.imports?.forEach((importedModule: any) =>
      this.registerModule(importedModule)
    );

    moduleMetadata.providers?.forEach((provider: IProvider) => {
      this.providers.set(provider, this.resolveDependencies(provider));
    });

    this.registerControllers(moduleMetadata.controllers, this.globalPrefix);

    moduleMetadata.exports?.forEach((exportedProvider: IProvider) => {
      this.providers.set(
        exportedProvider,
        this.resolveDependencies(exportedProvider)
      );
    });
  }

  protected registerControllers(
    controllers: IController[] | undefined,
    globalPrefix: string
  ) {
    controllers?.forEach((Controller: IController) => {
      this.registerController(Controller, globalPrefix);
    });
  }

  protected registerController(
    Controller: IController,
    globalPrefix: string
  ): void {
    const prefix = Reflect.getMetadata(CONTROLLER_KEY, Controller) || "";
    const controller = new Controller(...this.providers.values());

    Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
      .filter((methodName) => methodName !== "constructor")
      .forEach((methodName) => {
        this.registerRoute(controller, methodName, prefix, globalPrefix);
      });
  }

  protected registerRoute(
    controller: IController,
    methodName: string,
    controllerPrefix: string,
    globalPrefix: string
  ): void {
    const method = Reflect.getMetadata(METHOD_KEY, controller, methodName);
    const route = Reflect.getMetadata(ROUTE_KEY, controller, methodName) || "";

    const options =
      Reflect.getMetadata(SCOPE_OPTIONS_KEY, controller, methodName) || {};

    if (method) {
      const fullPath = `${globalPrefix}${controllerPrefix}${route}`;
      console.log(`🌴 Adding route ${method.toUpperCase()} ${fullPath}`);
      // @ts-ignore
      this[method](
        fullPath,
        async (ctx: Context) => {
          const args = this.extractRequestParameters(
            ctx,
            controller,
            methodName
          );

          const next = async () => {
            // @ts-ignore
            return (controller[methodName] as IControllerMethod)(...args);
          };

          const interceptors = Reflect.getMetadata(
            INTERCEPTORS_KEY,
            controller,
            methodName
          );
          if (interceptors) {
            for (const interceptor of interceptors) {
              const result = await interceptor.intercept(ctx, next);
              if (result !== undefined) {
                return result;
              }
            }
          }

          const guards = Reflect.getMetadata(
            GUARDS_KEY,
            controller,
            methodName
          );
          if (guards) {
            for (const guard of guards) {
              const canActivate = await guard.canActivate(ctx, next);
              if (!canActivate) {
                return new Response(
                  JSON.stringify({ message: "Unauthorized" }),
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    status: 403,
                  }
                );
              }
            }
          }
          // @ts-ignore
          return (controller[methodName] as IControllerMethod)(...args);
        },
        options
      );
    }
  }
}
