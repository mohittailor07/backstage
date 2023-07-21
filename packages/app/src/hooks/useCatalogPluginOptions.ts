import { usePluginOptions } from '@backstage/core-plugin-api/alpha';

export type CatalogPluginOptions = {
  createButtonTitle: string;
};

/** @ignore */
export type CatalogInputPluginOptions = {
  createButtonTitle: string;
};

export const useCatalogPluginOptions = () =>
  usePluginOptions<CatalogPluginOptions>();

export default useCatalogPluginOptions;

