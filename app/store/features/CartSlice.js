// categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { services: [] ,totalPrice:0 ,packages:[]},
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
    addPackageToCart: (state, action) => {
      state.packages.push(action.payload.item)
      state.totalPrice = Number(state.totalPrice) + Number(action.payload.price);    

      console.log("adding new item from slice",state.packages,state.totalPrice)
    },
    removePackageFromCart: (state, action) => {
        const indexToRemove = state.packages.findIndex(item => item === action.payload.item);
        if (indexToRemove !== -1) {
          state.packages.splice(indexToRemove, 1);
      state.totalPrice = Number(state.totalPrice) - Number(action.payload.price);    
  }
    },
    AddDiscount:(state,action) => {
      state.totalPrice=action.payload
    },
    RemoveDiscount:(state,action) => {
      state.totalPrice=action.payload
    },
    clearCart: (state) => {
      state.services = [];
      state.packages = [];
      state.totalPrice=0
    },
  },
 
});

export const {  removeServiceFromCart,clearCart,addServiceToCart,AddDiscount,RemoveDiscount,addPackageToCart,removePackageFromCart,addTotalBalance,removeFromtotalBalance} = cartSlice.actions;
export default cartSlice.reducer;
