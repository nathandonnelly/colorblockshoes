  // Replaces product name if product is equal to male or female shoes.
  export const handleProductName = (product) => {
    if (product.categories[0].name === "Women's Shoes" ) {
      return product.name.replace("Women’s ", "");
    } else if (product.categories[0].name === "Men's Shoes") {
      return product.name.replace("Men’s ", "");
    } else return product.name;
  }