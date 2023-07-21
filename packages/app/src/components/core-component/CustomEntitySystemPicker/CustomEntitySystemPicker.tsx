
import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { CustomSelectComponent } from '../CustomSelectComponent';
import { useSystemTypeFilter } from '../../../hooks/useSystemFilter';
/**
 * Props for {@link CustomEntitySystemPicker}.
 *
 * @public
 */
export interface CustomEntitySystemPickerProps {
  initialFilter?: string;
  hidden?: boolean;
  label?: string;
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

/** @public */
export const CustomEntitySystemPicker = (props: CustomEntitySystemPickerProps) => {
  const { hidden, initialFilter, label = '' } = props;
  const alertApi = useApi(alertApiRef);
  const { error, availableTypes, selectedTypes, setSelectedTypes } = useSystemTypeFilter();
  const classes = useStyles();

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load system types`,
        severity: 'error',
      });
    }
    if (initialFilter) {
      setSelectedTypes([initialFilter]);
    }
  }, [error, alertApi, initialFilter, setSelectedTypes]);

  if (availableTypes.length === 0 || error) return null;

  const items = [
    { value: 'all', label: 'all' },
    ...availableTypes.map((type: string) => ({
      value: type,
      label: type,
    })),
  ];

  return hidden ? null : (
    <Box
      className={classes.root}
      mr={1}
    >
      <CustomSelectComponent
        label={label}
        items={items}
        selected={(items.length > 1 ? selectedTypes[0] : undefined) ?? 'all'}
        onChange={value =>
          setSelectedTypes(value === 'all' ? [] : [String(value)])
        }
      />
    </Box>
  );
};
