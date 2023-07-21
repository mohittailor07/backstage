
import { useEffect, useMemo, useRef, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { useApi } from '@backstage/core-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import { createApiRef } from '@backstage/core-plugin-api';
import { EntityFilter, DefaultEntityFilters, useEntityList } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

class EntitySystemFilter implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    return this.values.some(v => entity.spec?.system === v);
  }
  getTypes(): string[] {
    return Array.isArray(this.values) ? this.values : [this.values];
  }
}

export type CustomFilters = DefaultEntityFilters & {
  system?: EntitySystemFilter | undefined;
};
  
export const catalogApiRef = createApiRef<CatalogApi>({
    id: 'plugin.catalog.service',
  });

/**
 * A hook built on top of `useEntityList` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 * @public
 */
export function useSystemTypeFilter(): {
  loading: boolean;
  error?: Error;
  availableTypes: string[];
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
} {
  const catalogApi = useApi(catalogApiRef);
  const {
    filters: { kind: kindFilter, system: systemFilter},
    queryParameters: { type: typeParameter },
    updateFilters,
  } = useEntityList<CustomFilters>();

  const flattenedQueryTypes = useMemo(
    () => [typeParameter].flat().filter(Boolean) as string[],
    [typeParameter],
  );

  const [selectedTypes, setSelectedTypes] = useState(
    flattenedQueryTypes.length
      ? flattenedQueryTypes
      : systemFilter?.getTypes() ?? [],
  );

  // Set selected types on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (flattenedQueryTypes.length) {
      setSelectedTypes(flattenedQueryTypes);
    }
  }, [flattenedQueryTypes]);

  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const kind = useMemo(() => kindFilter?.value, [kindFilter]);

  // Load all valid spec.type values straight from the catalogApi, paying attention to only the
  // kind filter for a complete list.
  const {
    error,
    loading,
    value: facets,
  } = useAsync(async () => {
    if (kind) {
      const items = await catalogApi
        .getEntityFacets({
          filter: { kind },
          facets: ['spec.system'],
        })
        .then(response => response.facets['spec.system'] || []);
      return items;
    }
    return [];
  }, [kind, catalogApi]);

  const facetsRef = useRef(facets);
  useEffect(() => {
    const oldFacets = facetsRef.current;
    facetsRef.current = facets;
    // Delay processing hook until kind and facets load updates have settled to generate list of types;
    // This prevents resetting the type filter due to saved type value from query params not matching the
    // empty set of type values while values are still being loaded; also only run this hook on changes
    // to facets
    if (loading || !kind || oldFacets === facets || !facets) {
      return;
    }

    // Sort by facet count descending, so the most common types appear on top
    const newTypes = [
      ...new Set(
        sortBy(facets, f => -f.count).map(f =>
          f.value.toLocaleLowerCase('en-US'),
        ),
      ),
    ];
    setAvailableTypes(newTypes);

    // Update type filter to only valid values when the list of available types has changed
    const stillValidTypes = selectedTypes.filter(value =>
      newTypes.includes(value),
    );
    if (!isEqual(selectedTypes, stillValidTypes)) {
      setSelectedTypes(stillValidTypes);
    }
  }, [loading, kind, selectedTypes, setSelectedTypes, facets]);

  useEffect(() => {
    updateFilters({
      type: selectedTypes.length
        ? new EntitySystemFilter(selectedTypes)
        : undefined,
    });
  }, [selectedTypes, updateFilters]);

  return {
    loading,
    error,
    availableTypes,
    selectedTypes,
    setSelectedTypes,
  };
}
