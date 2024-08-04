import { ModuleMetadataKeys as metadataConstants } from '../constants';

export const INVALID_MODULE_CONFIG_MESSAGE = (
  text: TemplateStringsArray,
  property: string,
) => `Invalid property '${property}' passed into the @Module() decorator.`;

const metadataKeys = [
  metadataConstants.IMPORTS_KEY,
  metadataConstants.EXPORTS_KEY,
  metadataConstants.CONTROLLERS_KEY,
  metadataConstants.PROVIDERS_KEY,
];

export function validateModuleKeys(keys: symbol[]) {
  const validateKey = (key: symbol) => {
    if (metadataKeys.includes(key)) {
      return;
    }
    throw new Error(INVALID_MODULE_CONFIG_MESSAGE`${String(key)}`);
  };
  keys.forEach(validateKey);
}
