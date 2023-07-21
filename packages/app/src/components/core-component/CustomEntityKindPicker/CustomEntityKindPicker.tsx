import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { EntityKindFilter, useEntityList } from '@backstage/plugin-catalog-react';
import { Box, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomSelectComponent } from '../CustomSelectComponent';
import { useAllKinds } from '../../../hooks/useAllKinds';
import { filterKinds } from '../../../utils/kindFilterUtils';

function useEntityKindFilter(opts: { initialFilter: string }): {
  loading: boolean;
  error?: Error;
  allKinds: string[];
  selectedKind: string;
  setSelectedKind: (kind: string) => void;
} {
  const {
    filters,
    queryParameters: { kind: kindParameter },
    updateFilters,
  } = useEntityList();

  const queryParamKind = useMemo(
    () => [kindParameter].flat()[0],
    [kindParameter],
  );

  const [selectedKind, setSelectedKind] = useState(
    queryParamKind ?? filters.kind?.value ?? opts.initialFilter,
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKind) {
      setSelectedKind(queryParamKind);
    }
  }, [queryParamKind]);

  // Set selected kind from filters; this happens when the kind filter is
  // updated from another component
  useEffect(() => {
    if (filters.kind?.value) {
      setSelectedKind(filters.kind?.value);
    }
  }, [filters.kind]);

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  const { allKinds, loading, error } = useAllKinds();

  return {
    loading,
    error,
    allKinds: allKinds ?? [],
    selectedKind,
    setSelectedKind,
  };
}

const useStyles = makeStyles(
  () =>
    createStyles({
      root: {
        '& div': {
          marginTop: 0,
        }
      }
    }),
);

/**
 * Props for {@link EntityKindPicker}.
 *
 * @public
 */
export interface CustomEntityKindPickerProps {
  /**
   * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
   * displayed.
   */
  allowedKinds?: string[];
  initialFilter?: string;
  hidden?: boolean;
}

/** @public */
export const CustomEntityKindPicker = (props: CustomEntityKindPickerProps) => {
  const classes = useStyles();
  const { allowedKinds, hidden, initialFilter = 'component' } = props;

  const alertApi = useApi(alertApiRef);

  const { error, allKinds, selectedKind, setSelectedKind } =
    useEntityKindFilter({
      initialFilter: initialFilter,
    });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  if (error) return null;

  const options = filterKinds(allKinds, allowedKinds, selectedKind);

  const items = Object.keys(options).map(key => ({
    value: key,
    label: options[key],
  }));

  return hidden ? null : (
    <Box
      className={classes.root}
      mr={1}
    >
      <CustomSelectComponent
        label="Kind"
        items={items}
        selected={selectedKind.toLocaleLowerCase('en-US')}
        onChange={value => setSelectedKind(String(value))}
      />
    </Box>
  );
};