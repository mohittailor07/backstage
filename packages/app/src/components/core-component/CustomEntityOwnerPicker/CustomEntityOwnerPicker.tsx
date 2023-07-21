import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  makeStyles,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect, useMemo, useState } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import { EntityOwnerFilter, humanizeEntityRef, useEntityList } from '@backstage/plugin-catalog-react';
import { humanizeEntity } from '../../../utils/humanize';
import { Autocomplete } from '@material-ui/lab';
import { useDebouncedEffect } from '@react-hookz/web';
import { useFetchEntities } from '../../../hooks/useFetchEntities';

/** @public */
export type CatalogReactEntityOwnerPickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {
      height: '100%',
    },
    inputMainRoot: {
      // transform: "translate(12px, 4px) scale(0.75)",
      height: '100%',
      '&div': {
        height: '100%',
      },
    },
    inputLabelRoot: {
      fontSize: 16,
      fontWeight: 500,
      transform: "translate(12px, 4px) scale(0.75) !important",
      color: "#665e5a !important",
    },
    autoComplete: {
      height: '100%',
      minWidth: 240,
    },
    autoCompleteRoot: {
      height: '100%',
      '& fieldset': {
        borderWidth: 2,
        borderColor: '#726b67 !important',
      },
    },
    autoCompleteInputRoot: {
      height: '100%'
    },
    autoCompleteTagRoot: {
      margin: '12px 0 0 0'
    },
  },
  {
    name: 'CatalogReactEntityOwnerPicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * @public
 */
export type EntityOwnerPickerProps = {
  mode?: string | 'owners-only' | 'all';
  label?: string;
};

/** @public */
export const EntityOwnerPicker = (props?: EntityOwnerPickerProps) => {
  const classes = useStyles();
  const { mode = 'owners-only', label = '' } = props || {};
  const {
    updateFilters,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityList();

  const [text, setText] = useState('');

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  const [{ value, loading }, handleFetch, cache] = useFetchEntities({
    mode,
    initialSelectedOwnersRefs: selectedOwners,
  });
  useDebouncedEffect(() => handleFetch({ text }), [text, handleFetch], 250);

  const availableOwners = value?.items || [];

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      const filter = new EntityOwnerFilter(queryParamOwners);
      setSelectedOwners(filter.values);
    }
  }, [queryParamOwners]);

  useEffect(() => {
    updateFilters({
      owners: selectedOwners.length
        ? new EntityOwnerFilter(selectedOwners)
        : undefined,
    });
  }, [selectedOwners, updateFilters]);

  if (
    ['user', 'group'].includes(
      filters.kind?.value.toLocaleLowerCase('en-US') || '',
    )
  ) {
    return null;
  }

  return (
    <Box>
      <Autocomplete
        className={classes.autoComplete}
        classes={{
          root: classes.autoCompleteRoot,
          inputRoot: classes.autoCompleteInputRoot,
          tag: classes.autoCompleteTagRoot,
        }}
        multiple
        aria-label={label}
        disableCloseOnSelect
        loading={loading}
        options={availableOwners}
        value={selectedOwners as unknown as Entity[]}
        getOptionSelected={(o, v) => {
          if (typeof v === 'string') {
            return stringifyEntityRef(o) === v;
          }
          return o === v;
        }}
        getOptionLabel={o => {
          const entity =
            typeof o === 'string'
              ? cache.getEntity(o) ||
              parseEntityRef(o, {
                defaultKind: 'group',
                defaultNamespace: 'default',
              })
              : o;
          return humanizeEntity(entity, humanizeEntityRef(entity));
        }}
        onChange={(_: object, owners) => {
          setText('');
          setSelectedOwners(
            owners.map(e => {
              const entityRef =
                typeof e === 'string' ? e : stringifyEntityRef(e);

              if (typeof e !== 'string') {
                cache.setEntity(e);
              }

              return entityRef;
            }),
          );
        }}
        filterOptions={x => x}
        renderOption={(entity, { selected }) => {
          const isGroup = entity.kind.toLocaleLowerCase('en-US') === 'group';

          return (
            <FormControlLabel
              control={
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={selected}
                />
              }
              onClick={event => event.preventDefault()}
              label={
                <Box display="flex" flexWrap="wrap" alignItems="center">
                  {isGroup ? (
                    <GroupIcon fontSize="small" />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                  &nbsp;
                  {humanizeEntity(
                    entity,
                    humanizeEntityRef(entity, { defaultKind: entity.kind }),
                  )}
                </Box>
              }
            />
          );
        }}
        popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
        renderInput={params => (
          <TextField
            {...params}
            label={label || 'Owner'}
            size="small"
            className={classes.input}
            classes={{
              root: classes.inputMainRoot,
            }}
            onChange={e => {
              setText(e.currentTarget.value);
            }}
            InputLabelProps={{
              shrink: false,
              classes: {
                root: classes.inputLabelRoot,
              }
            }}
            variant="outlined"
          />
        )}
        ListboxProps={{
          onScroll: (e: React.MouseEvent) => {
            const element = e.currentTarget;
            const hasReachedEnd =
              Math.abs(
                element.scrollHeight -
                element.clientHeight -
                element.scrollTop,
              ) < 1;

            if (hasReachedEnd && value?.cursor) {
              handleFetch({ items: value.items, cursor: value.cursor });
            }
          },
          'data-testid': 'owner-picker-listbox',
        }}
      />
    </Box>
  );
};