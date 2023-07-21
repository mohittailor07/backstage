export function filterKinds(
  allKinds: string[],
  allowedKinds?: string[],
  forcedKinds?: string,
): Record<string, string> {
  // Before allKinds is loaded, or when a kind is entered manually in the URL, selectedKind may not
  // be present in allKinds. It should still be shown in the dropdown, but may not have the nice
  // enforced casing from the catalog-backend. This makes a key/value record for the Select options,
  // including selectedKind if it's unknown - but allows the selectedKind to get clobbered by the
  // more proper catalog kind if it exists.
  let availableKinds = allKinds;
  if (allowedKinds) {
    availableKinds = availableKinds.filter(k =>
      allowedKinds.some(
        a => a.toLocaleLowerCase('en-US') === k.toLocaleLowerCase('en-US'),
      ),
    );
  }
  if (
    forcedKinds &&
    !allKinds.some(
      a =>
        a.toLocaleLowerCase('en-US') === forcedKinds.toLocaleLowerCase('en-US'),
    )
  ) {
    availableKinds = availableKinds.concat([forcedKinds]);
  }

  const kindsMap = availableKinds.sort().reduce((acc, kind) => {
    acc[kind.toLocaleLowerCase('en-US')] = kind;
    return acc;
  }, {} as Record<string, string>);

  return kindsMap;
}
