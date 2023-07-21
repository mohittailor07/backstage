import React from 'react';
import { Box, List, ListItemText, Typography, makeStyles } from '@material-ui/core';
import { EntityListProvider } from '@backstage/plugin-catalog-react';
import { Content, PageWithHeader } from '@backstage/core-components';
import HomePageContentImg from '../../assets/content.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listItemInset: {
    paddingLeft: 16,
  },
}));

export const HomePage = () => {
  const classes = useStyles();

  return (
    <EntityListProvider>
      <Content>
        <Box mb={2}>
          <Box
          sx={{
            border: '4px double',
            borderRadius: 8,
          }}
            component="img"
            alt="Home image N/A."
            src={HomePageContentImg}
          />
        </Box>
        <Box mt={2}>
          <Typography variant="h4" style={{ fontWeight: "500", marginBottom: 32 }}>Motivation</Typography>
          <Typography style={{ marginBottom: 16 }}>The goal of <strong style={{ fontStyle: 'italic' }}>API Design Guidelines</strong> to define standards and guidelines that promote consistency and quality across UPS APIs.</Typography>
          <Typography>The primary audience for these guidelines are <strong style={{ fontStyle: 'italic' }}>API Providers.</strong></Typography>

          <Box mt={3} mb={3} pl={3} sx={{ fontStyle: 'italic' }}>
            <Typography component={'p'} >API Providers are defined as the <strong>teams that design, build, expose, and operate APIs</strong></Typography>
          </Box>
          
          <Box mt={3} mb={3}>
            <Typography component={'p'}>These guidelines lay the foundation for developing APIs that are consistent, secure, maintainable, easily discoverable and reusable.</Typography>
          </Box>

          <Typography variant="h5" style={{ fontWeight: "500", marginBottom: 8 }}>
            How to read the Guidelines
          </Typography>

          <Typography variant="body1">
            The following key words in this document are to be interpreted as described in RFC2119.
          </Typography>

          <List component="nav" aria-label="List Items">
            <ListItemText className={classes.listItemInset} inset primary={`• "MUST", "MUST NOT"`} />
            <ListItemText className={classes.listItemInset} inset primary={`• "REQUIRED"`} />
            <ListItemText className={classes.listItemInset} inset primary={`• "SHALL" "SHALL NOT"`} />
            <ListItemText className={classes.listItemInset} inset primary={`• "SHOUID" "SHOULD NOT",`} />
            <ListItemText className={classes.listItemInset} inset primary={`• "RECOMMENDED"`} />
            <ListItemText className={classes.listItemInset} inset primary={`• "MAY", and "OPTIONAL"`} />
          </List>

        </Box>
      </Content>
    </EntityListProvider>  
  )
};