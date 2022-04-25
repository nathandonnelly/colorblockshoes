import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: null,
  cartContents: [],
}

export const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    updateProducts: (state, action) => {
      if (state.products === null) {
        state.products = action.payload;
      } else {
        state.products = state.products.concat(action.payload);
      }
    },

    addToCart: (state, action) => {
      if (state.cartContents.length === 0) {
          state.cartContents = state.cartContents.concat(action.payload);
          return;
      };

      for (let i = 0; i < state.cartContents.length; i++ ) {
          if (
            state.cartContents[i].product.id === action.payload.product.id &&
            state.cartContents[i].size === action.payload.size
          ) {
              state.cartContents[i].quantity = state.cartContents[i].quantity + action.payload.quantity;
              return;
          };
      };

      state.cartContents = state.cartContents.concat(action.payload);
      return;

    },

    addOneQuantity: (state, action) => {
      for (let i = 0; i < state.cartContents.length; i++) {
        if (
            state.cartContents[i].product.id === action.payload.product.id
            && state.cartContents[i].size === action.payload.size
            && state.cartContents[i].quantity < 9
        ) {
          state.cartContents[i].quantity = state.cartContents[i].quantity + 1;
        }
      }
    },

    removeOneQuantity: (state, action) => {
      for (let i = 0; i < state.cartContents.length; i++) {
        if (
            state.cartContents[i].product.id === action.payload.product.id
            && state.cartContents[i].size === action.payload.size
        ) {
          if (state.cartContents[i].quantity === 1) {
            state.cartContents.splice(i, 1)
          } else {
            state.cartContents[i].quantity = state.cartContents[i].quantity + -1;
          }
        }
      }
    },

    removeFromCart: (state, action) => {
      for (let i = 0; i < state.cartContents.length; i++) {
        if (
          state.cartContents[i].product.id === action.payload.product.id
          && state.cartContents[i].size === action.payload.size
        ) {
          state.cartContents.splice(i, 1);
        }
      }
    }

  },
});

export const { updateProducts, addToCart, addOneQuantity, removeOneQuantity, removeFromCart, } = storeSlice.actions

export default storeSlice.reducer