import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ClosedDropdown from './static/ClosedDropdown';
import OpenedDropdown from './static/OpenedDropdown';

/** @public */
export type CustomSelectInputBaseClassKey = 'root' | 'input';

const BootstrapInput = withStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        'label + &': {
          marginTop: theme.spacing(3),
        },
      },
      input: {
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: theme.typography.body1.fontSize,
        padding: theme.spacing(1.25, 3.25, 1.25, 1.5),
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: 'Helvetica Neue',
        '&:focus': {
          background: 'unset',
          borderRadius: theme.shape.borderRadius,
        },
      },
    }),

  { name: 'CustomSelectInputBase' },
)(InputBase);

/** @public */
export type CustomSelectClassKey =
  | 'formControl'
  | 'label'
  | 'chips'
  | 'chip'
  | 'checkbox'
  | 'root';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      formControl: {
        margin: `${theme.spacing(1)} 0px`,
        maxWidth: 300,
        height: '100%'
      },
      formLabel: {
        transform: 'initial',
        fontWeight: 'bold',
        fontSize: theme.typography.body2.fontSize,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        '&.Mui-focused': {
          color: theme.palette.text.primary,
        },
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      checkbox: {},
      root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      },
      select: {
        height: "100%",
        border: "2px solid #726b67",
        borderRadius: "5px",
        padding: '16px 12px 6px 12px',
        "&::after": {
          borderRadius: "5px",
          border: "0px !important"
        },
        "&::before": {
          borderRadius: "5px",
          borderBottom: "0px !important"
        },
        "& .MuiSelect-select": {
          
        },
        "& .MuiFormLabel-root": {
          
        },
        "& .Mui-focused": {
          color: "#665e5a"
        }
      },
      selectRoot: {
        borderRadius: "4px",
        backgroundColor: "unset",
        padding: 0,
        border: 'none',
      },
      inputRootClass: {
        transform: "translate(12px, 4px) scale(0.75)",
        color: "#665e5a !important",
        fontWeight: 500,
        fontSize: "16px",
        "& .Mui-focused": {
          color: "#665e5a"
        },
        "&.MuiFormLabel-root": {
          transform: "translate(12px, 10px) scale(0.75)",
          fontWeight: 500,
          fontSize: "16px"
        }
      }
    }),
  { name: 'BackstageSelect' },
);

/** @public */
export type CustomSelectItem = {
  label: string;
  value: string | number;
};

/** @public */
export type CustomSelectedItems = string | string[] | number | number[];

export type CustomSelectComponentProps = {
  multiple?: boolean;
  items: CustomSelectItem[];
  label: string;
  placeholder?: string;
  selected?: CustomSelectedItems;
  onChange: (arg: CustomSelectedItems) => void;
  triggerReset?: boolean;
  native?: boolean;
  disabled?: boolean;
  margin?: 'dense' | 'none';
};

/** @public */
export function CustomSelectComponent(props: CustomSelectComponentProps) {
  const {
    multiple,
    items,
    label,
    placeholder,
    selected,
    onChange,
    triggerReset,
    native = false,
    disabled = false,
    margin,
  } = props;
  const classes = useStyles();
  const [value, setValue] = useState<CustomSelectedItems>(
    selected || (multiple ? [] : ''),
  );
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setValue(multiple ? [] : '');
  }, [triggerReset, multiple]);

  useEffect(() => {
    setValue(selected || (multiple ? [] : ''));
  }, [selected, multiple]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as CustomSelectedItems);
    onChange(event.target.value as CustomSelectedItems);
  };

  const handleOpen = (event: React.ChangeEvent<any>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    setOpen(previous => {
      if (multiple && !(event.target instanceof HTMLElement)) {
        return true;
      }
      return !previous;
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (selectedValue: string | number) => () => {
    const newValue = (value as any[]).filter(chip => chip !== selectedValue);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Box className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.formLabel} classes={{ root: classes.inputRootClass }}>{label}</InputLabel>
        <Select
          className={classes.select}
          classes={{
            root: classes.selectRoot,
          }}
          variant="filled"
          aria-label={label}
          value={value}
          native={native}
          disabled={disabled}
          data-testid="select"
          displayEmpty
          multiple={multiple}
          margin={margin}
          onChange={handleChange}
          open={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          input={<BootstrapInput />}
          label={label}
          tabIndex={0}
          renderValue={s =>
            multiple && (value as any[]).length !== 0 ? (
              <Box className={classes.chips}>
                {(s as string[]).map(selectedValue => (
                  <Chip
                    key={items.find(el => el.value === selectedValue)?.value}
                    label={items.find(el => el.value === selectedValue)?.label}
                    clickable
                    onDelete={handleDelete(selectedValue)}
                    className={classes.chip}
                  />
                ))}
              </Box>
            ) : (
              <Typography>
                {(value as any[]).length === 0
                  ? placeholder || ''
                  : items.find(el => el.value === s)?.label}
              </Typography>
            )
          }
          IconComponent={() =>
            !isOpen ? <ClosedDropdown /> : <OpenedDropdown />
          }
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          {placeholder && !multiple && (
            <MenuItem value={[]}>{placeholder}</MenuItem>
          )}
          {native
            ? items &&
              items.map(item => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))
            : items &&
              items.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {multiple && (
                    <Checkbox
                      color="primary"
                      checked={(value as any[]).includes(item.value) || false}
                      className={classes.checkbox}
                    />
                  )}
                  {item.label}
                </MenuItem>
              ))}
        </Select>
        
      </FormControl>
    </Box>
  );
}