import { columnFactories } from './columns';

export const customColumnsList = [
    columnFactories.createNameColumn(),
    columnFactories.createSystemColumn(),
    columnFactories.createOwnerColumn(),
    columnFactories.createDomainColumn(),
    columnFactories.createSpecTypeColumn({ hidden: false }),
    columnFactories.createMetadataDescriptionColumn(),
    columnFactories.createTagsColumn(),
    columnFactories.createTitleColumn({ hidden: true }),
];
