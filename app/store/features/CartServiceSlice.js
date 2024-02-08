import { createSlice } from "@reduxjs/toolkit";

const CartServiceSlice = createSlice({
    name: "cartService",
    initialState: {
      services: [],
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
        // Find the index of the service to remove
        const index = state.services.findIndex(
          (service) => service.id === action.payload.id
        );
  
        if (index !== -1) {
          // If the service exists, remove it from the cart
          const removedService = state.services.splice(index,   1)[0];
          // Subtract the price of the removed service from the total price
          state.totalPrice -= removedService.qty * removedService.price;
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
          service.qty = action.payload.quantity;
  
          // Calculate the difference in price due to the change in quantity
          const priceDifference = (service.qty - oldQty) * service.price;
          // Update the total price
          state.totalPrice += priceDifference;
  
          // If the updated quantity is   0, remove the service from the cart
          if (service.qty ===   0) {
            state.services.splice(serviceIndex,   1);
            // Also subtract the full price of the removed service from the total price
            state.totalPrice -= oldQty * service.price;
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
    RemoveDiscount
  } = CartServiceSlice.actions;
  
  export default CartServiceSlice.reducer;
  
