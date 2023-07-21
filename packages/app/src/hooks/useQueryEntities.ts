import { useApi } from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

type QueryEntitiesResponse = {
  items: Entity[];
  cursor?: string;
};

export function useQueryEntities() {
  const catalogApi = useApi(catalogApiRef);
  return useAsyncFn(
    async (
      request: { text: string } | QueryEntitiesResponse,
      options?: { limit: number },
    ): Promise<QueryEntitiesResponse> => {
      const initialRequest = request as { text: string };
      const cursorRequest = request as QueryEntitiesResponse;
      const limit = options?.limit ?? 20;

      if (cursorRequest.cursor) {
        const response = await catalogApi.queryEntities({
          cursor: cursorRequest.cursor,
          limit,
        });
        return {
          cursor: response.pageInfo.nextCursor,
          items: [...cursorRequest.items, ...response.items],
        };
      }

      const response = await catalogApi.queryEntities({
        fullTextFilter: {
          term: initialRequest.text || '',
          fields: [
            'metadata.name',
            'kind',
            'spec.profile.displayname',
            'metadata.title',
          ],
        },
        filter: { kind: ['User', 'Group'] },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        limit,
      });

      return {
        cursor: response.pageInfo.nextCursor,
        items: response.items,
      };
    },
    [],
    { loading: true },
  );
}