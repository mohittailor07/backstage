import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from './useSystemFilter';

export function useAllKinds(): {
  loading: boolean;
  error?: Error;
  allKinds: string[];
} {
  const catalogApi = useApi(catalogApiRef);

  const {
    error,
    loading,
    value: allKinds,
  } = useAsync(async () => {
    const items = await catalogApi
      .getEntityFacets({ facets: ['kind'] })
      .then(response => response.facets.kind?.map(f => f.value).sort() || []);
    return items;
  }, [catalogApi]);

  return { loading, error, allKinds: allKinds ?? [] };
}
