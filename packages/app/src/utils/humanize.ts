import { Entity } from "@backstage/catalog-model";
import get from 'lodash/get';

export function humanizeEntity(entity: Entity, defaultName: string) {
  for (const path of ['spec.profile.displayName', 'metadata.title']) {
    const value = get(entity, path);
    if (value && typeof value === 'string') {
      return value;
    }
  }
  return defaultName;
}