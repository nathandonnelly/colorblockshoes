export const handleCartQuantity = (cartContents) => {
  let cartQuantity = 0;
  for (let i = 0; i < cartContents.length; i++) {
    cartQuantity = cartQuantity + cartContents[i].quantity;
  }
  return cartQuantity;
}