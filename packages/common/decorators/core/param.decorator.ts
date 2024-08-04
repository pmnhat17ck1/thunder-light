import "reflect-metadata";
import {
  REQ_KEY,
  RES_KEY,
  PARAMS_KEY,
  QUERY_KEY,
  HEADERS_KEY,
  COOKIES_KEY,
  STORE_KEY,
  PATH_KEY,
  REDIRECT_KEY,
  ERROR_KEY,
  URL_KEY,
} from "@thunder-light/common/constants";

function createParamDecorator(paramKey: symbol) {
  return function (key?: string): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
      const existingParams =
        Reflect.getMetadata(paramKey, target, propertyKey as any) || [];
      existingParams.push({ key, index: parameterIndex });
      Reflect.defineMetadata(
        paramKey,
        existingParams,
        target,
        propertyKey as any
      );
    };
  };
}

export const Req = createParamDecorator(REQ_KEY);
export const Res = createParamDecorator(RES_KEY);
export const Params = createParamDecorator(PARAMS_KEY);
export const Query = createParamDecorator(QUERY_KEY);
export const Headers = createParamDecorator(HEADERS_KEY);
export const Cookies = createParamDecorator(COOKIES_KEY);
export const Store = createParamDecorator(STORE_KEY);
export const Path = createParamDecorator(PATH_KEY);
export const Redirect = createParamDecorator(REDIRECT_KEY);
export const Error = createParamDecorator(ERROR_KEY);
export const URL = createParamDecorator(URL_KEY);
