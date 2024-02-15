import { createSlice } from "@reduxjs/toolkit";

const CartServiceSlice = createSlice({
    name: "cartService",
    initialState: {
      services: [],
      category_id:0,
      totalPrice:  0, // Total price of all items in the cart
    },
    reducers: {
      addServiceToCart: (state, action) => {
        const serviceExists = state.services.find(
          (service) => service.id === action.payload.id
        );
  
        if (serviceExists) {
          // If the service exists, increment the quantity
          serviceExists.qty += action.payload.qty;
        } else {
          // If the service doesn't exist, add it to the cart
          state.services.push(action.payload);
        }
  
        // Recalculate the total price
        state.totalPrice = state.services.reduce((sum, service) => sum + service.qty * service.price,  0);
      },
      removeServiceFromCart: (state, action) => {
        const serviceToRemove = state.services.find(
          (service) => service.id === action.payload.id
        );
      
        if (serviceToRemove) {
          // If the service exists, remove it from the cart
          state.services = state.services.filter(
            (service) => service.id !== action.payload.id
          );
      
          // Subtract the price of the removed service from the total price
          state.totalPrice -= serviceToRemove.price * serviceToRemove.qty;
        }
      },
      
      updateServiceQuantity: (state, action) => {
        // Find the service and update its quantity
        const serviceIndex = state.services.findIndex(
          (service) => service.id === action.payload.id
        );
      
        if (serviceIndex !== -1) {
          const service = state.services[serviceIndex];
          const oldQty = service.qty;
          const newQty = action.payload.quantity;
      
          // Calculate the difference in price due to the change in quantity
          const priceDifference = (newQty - oldQty) * service.price;
      
          // Update the total price
          state.totalPrice += priceDifference;
      
          // If the updated quantity is  0, remove the service from the cart
          if (newQty ===  0) {
            state.services.splice(serviceIndex,  1);
          } else {
            // Otherwise, update the quantity in the cart
            service.qty = newQty;
          }
        }
      },
      
      clearCart: (state) => {
        // Clear the entire cart
        state.services = [];
        // Reset the total price
        state.totalPrice =  0;
      },
      AddDiscount:(state,action) => {
        state.totalPrice=action.payload
      },
      setCategoryId:(state,action) => {
        state.category_id=action.payload
      },
      RemoveDiscount:(state,action) => {
        state.totalPrice=action.payload
      },
    },
  });
  export const {
    addServiceToCart,
    removeServiceFromCart,
    updateServiceQuantity,
    clearCart,
    AddDiscount,
    RemoveDiscount,
    setCategoryId
  } = CartServiceSlice.actions;
  
  export default CartServiceSlice.reducer;
  
