// categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { services: [] ,totalPrice:0 },
  reducers: {
    addServiceToCart: (state, action) => {
      state.services.push(action.payload.item)
      state.totalPrice = Number(state.totalPrice) + Number(action.payload.price);    

      console.log("adding new item from slice",state.services,state.totalPrice)
    },
    removeServiceFromCart: (state, action) => {
        const indexToRemove = state.services.findIndex(item => item === action.payload.item);
        if (indexToRemove !== -1) {
          state.services.splice(indexToRemove, 1);
      state.totalPrice = Number(state.totalPrice) - Number(action.payload.price);    
  }
    },
    clearCart: (state) => {
      state.services = [];
      state.totalPrice=0
    },
  },
 
});

export const {  removeServiceFromCart,clearCart,addServiceToCart,addTotalBalance,removeFromtotalBalance} = cartSlice.actions;
export default cartSlice.reducer;
