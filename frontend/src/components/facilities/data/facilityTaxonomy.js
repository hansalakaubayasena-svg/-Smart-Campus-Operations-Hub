export const buildCategoriesByType = (types = []) =>
  types.reduce((acc, type) => {
    acc[type.name] = (type.categories || []).map((category) => category.name)
    return acc
  }, {})

export const buildSearchSuggestions = (types = []) =>
  Array.from(
    new Set(
      types.flatMap((type) => [type.name, ...(type.categories || []).map((category) => category.name)]),
    ),
  ).filter(Boolean)
