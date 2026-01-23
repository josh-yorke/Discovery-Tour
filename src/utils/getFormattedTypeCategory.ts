export const getFormattedTypeCategory = (type: string | null) => {
  let formattedTypeCategory = "";
  if (type === "country" || type === "pass-category") {
    formattedTypeCategory = type;
  } else {
    formattedTypeCategory = `${type}-type`;
  }
  return formattedTypeCategory;
};

export const getParentOfTypeCategory = (formattedTypeCategory: string) => {
  let parentOfTypeCategory = "";
  if (
    formattedTypeCategory === "country" ||
    formattedTypeCategory === "pass-category"
  ) {
    parentOfTypeCategory = formattedTypeCategory;
  } else {
    parentOfTypeCategory = `${formattedTypeCategory.replace("-type", "")}`;
  }
  return parentOfTypeCategory;
};
