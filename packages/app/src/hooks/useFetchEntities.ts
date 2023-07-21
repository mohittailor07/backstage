import { useRef } from 'react';
import { useFacetsEntities } from './useFacetsEntities';
import { useQueryEntities } from './useQueryEntities';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { useMountEffect } from '@react-hookz/web';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

export function useFetchEntities({
  mode,
  initialSelectedOwnersRefs,
}: {
  mode: 'owners-only' | 'all';
  initialSelectedOwnersRefs: string[];
}) {
  const isOwnersOnlyMode = mode === 'owners-only';
  const queryEntitiesResponse = useQueryEntities();
  const facetsEntitiesResponse = useFacetsEntities({
    enabled: isOwnersOnlyMode,
  });

  const [state, handleFetch] = isOwnersOnlyMode
    ? facetsEntitiesResponse
    : queryEntitiesResponse;

  return [
    state,
    handleFetch,
    useSelectedOwners({
      enabled: !isOwnersOnlyMode,
      initialSelectedOwnersRefs,
    }),
  ] as const;
}

/**
 * Hook used for storing the full entity of the specified owners
 * in order to display users and group using the information contained on each entity.
 * When a component is rendered for the first time, it loads the content of the entities
 * specified by `initialSelectedOwnersRefs` and export the `getEntity` and `setEntity`
 * utilities, used to retrieve and modify the owners.
 */
function useSelectedOwners({
  enabled,
  initialSelectedOwnersRefs,
}: {
  enabled: boolean;
  initialSelectedOwnersRefs: string[];
}) {
  const allEntities = useRef<Record<string, Entity>>({});
  const catalogApi = useApi(catalogApiRef);

  const [, handleFetch] = useAsyncFn(async () => {
    const initialSelectedEntities = await catalogApi.getEntitiesByRefs({
      entityRefs: initialSelectedOwnersRefs,
    });
    initialSelectedEntities.items.forEach(e => {
      if (e) {
        allEntities.current[stringifyEntityRef(e)] = e;
      }
    });
  }, []);

  useMountEffect(() => {
    if (enabled && initialSelectedOwnersRefs.length > 0) {
      handleFetch();
    }
  });

  return {
    getEntity: (entityRef: string) => allEntities.current[entityRef],
    setEntity: (entity: Entity) => {
      allEntities.current[stringifyEntityRef(entity)] = entity;
    },
  };
}