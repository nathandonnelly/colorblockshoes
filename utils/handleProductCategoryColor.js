export const handleProductCategoryColor = (productCategory) => {
  if (productCategory.includes("Women")) {
    return "#ff80ff";
  } else if (productCategory.includes("Men")) {
    return "#69afff";
  } else return "#ffdc14";
}