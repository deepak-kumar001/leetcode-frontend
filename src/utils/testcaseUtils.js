export function parseMetaData(metaData) {
  try {
    return JSON.parse(metaData);
  } catch {
    return null;
  }
}

export function parseStructuredTestcases(exampleTestcaseList, meta) {
  if (!Array.isArray(exampleTestcaseList) || !meta?.params) return [];

  return exampleTestcaseList.map((raw, index) => {
    const lines = raw.split("\n");

    return {
      id: index + 1,
      inputs: meta.params.map((param, i) => ({
        name: param.name,
        type: param.type,
        value: lines[i] ?? "",
      })),
    };
  });
}

export function stringifyStructuredTestcases(cases) {
  return cases
    .map(tc => tc.inputs.map(i => i.value).join("\n"))
    .join("\n");
}
