import "reflect-metadata";
import { IProvider } from "@thunder-light/common/interfaces";
import { DEPENDENCIES_KEY } from "@thunder-light/common/constants";
import { ExtractManager } from "./extract";

export abstract class ResolveManager extends ExtractManager {
  protected providers = new Map<IProvider, any>();
  protected globalPrefix = "";

  constructor() {
    super();
  }
  
  protected resolveDependencies(target: IProvider): any {
    const dependencies = Reflect.getMetadata(DEPENDENCIES_KEY, target) || [];

    const injections = dependencies.map((dep: IProvider) => {
      if (!this.providers.has(dep)) {
        this.providers.set(dep, this.resolveDependencies(dep));
      }
      return this.providers.get(dep);
    });

    return new target(...injections);
  }
}
