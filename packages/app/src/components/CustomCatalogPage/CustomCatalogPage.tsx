import React, { ReactNode } from 'react'
import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import {
  useRouteRef,
  useApi,
  configApiRef,
} from '@backstage/core-plugin-api';
import {
  CatalogTableRow,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogFilterLayout,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { CustomCatalogTable } from '../core-component/CustomCatalogTable';
import { Box, createStyles, makeStyles } from '@material-ui/core';
import { CustomEntitySystemPicker } from '../core-component/CustomEntitySystemPicker';
import { CustomEntityOwnerPicker } from '../core-component/CustomEntityOwnerPicker';
import { CustomEntityTypePicker } from '../core-component/CustomEntityTypePicker';
import { CustomEntityKindPicker } from '../core-component/CustomEntityKindPicker';
import useCatalogPluginOptions from '../../hooks/useCatalogPluginOptions';

const useStyles = makeStyles(
  () =>
    createStyles({
      catalogTableWrapper: {
        width: 'inherit',
      }
    }),
);

export interface CustomCatalogPageProps {
  columns: TableColumn<CatalogTableRow>[];
  actions?: TableProps<CatalogTableRow>['actions'];
  tableOptions?: TableProps<CatalogTableRow>['options'];
  emptyContent?: ReactNode;
}

export const CustomCatalogPage = ({
  columns,
  actions,
  tableOptions = {},
  emptyContent,
}: CustomCatalogPageProps) => {
  const createComponentLink = useRouteRef(
    catalogPlugin.externalRoutes.createComponent,
  );
  
  const classes = useStyles();

  const { createButtonTitle } = useCatalogPluginOptions();

  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="catalogHome">
      <EntityListProvider>
        <Content>
          <ContentHeader
            title=""
            titleComponent={
              <Box display="flex">
                <CustomEntityKindPicker initialFilter='api' />
                <CustomEntityTypePicker label='Type' />
                <CustomEntitySystemPicker label='System' />
                <CustomEntityOwnerPicker />
              </Box>
            }
          >
            <CreateButton
              title={createButtonTitle}
              to={createComponentLink && createComponentLink()}
            />
            <SupportButton>All your software catalog entities</SupportButton>
          </ContentHeader>
          <CatalogFilterLayout>
            <Box className={classes.catalogTableWrapper}>
              <CustomCatalogTable
                columns={columns}
                actions={actions}
                tableOptions={tableOptions}
                emptyContent={emptyContent}
              />
            </Box>
          </CatalogFilterLayout>
        </Content>
      </EntityListProvider>
    </PageWithHeader>
  );
};