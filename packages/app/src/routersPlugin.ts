import { catalogPlugin } from '@backstage/plugin-catalog';
import { CustomCatalogPageProps } from './components/CustomCatalogPage';
import { createRoutableExtension, createRouteRef } from '@backstage/core-plugin-api';

export const CustomCatalogIndexPage: (props: CustomCatalogPageProps) => JSX.Element =
  catalogPlugin.provide(
    createRoutableExtension({
      name: 'CustomCatalogIndexPage',
      component: () =>
        import('./components/CustomCatalogPage').then(m => m.CustomCatalogPage),
      mountPoint: createRouteRef({
        id: 'catalog',
      }),
    }),
  );