export const handleCartSubtotal = (cartContents) => {
  let cartSubtotal = 0;
  for (let i = 0; i < cartContents.length; i++) {
    cartSubtotal = cartSubtotal + (cartContents[i].product.price * cartContents[i].quantity)
  }
  return parseFloat(cartSubtotal.toFixed(2));
}

export const handleCartShipping = (cartContents) => {
  let cartSubtotal = handleCartSubtotal(cartContents);
  if (cartSubtotal > 100) {
    return "Free"
  } else if (cartSubtotal === 0) {
    return "Free"
  } else return "$10";
}