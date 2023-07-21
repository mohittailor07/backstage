import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';

/** @public */
export type ClosedDropdownClassKey = 'icon';

const useStyles = makeStyles(
  theme =>
    createStyles({
      icon: {
        position: 'absolute',
        right: theme.spacing(0.5),
        pointerEvents: 'none',
      },
    }),
  { name: 'BackstageClosedDropdown' },
);

const ClosedDropdown = () => {
  const classes = useStyles();
  return (
    <SvgIcon
      className={classes.icon}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 8L6 9.5L12.0703 15.5703L18.1406 9.5L16.6406 8L12.0703 12.5703L7.5 8Z"
        fill="#616161"
      />
    </SvgIcon>
  );
};

export default ClosedDropdown;
