import { configureStore } from "@reduxjs/toolkit";
import  userReducer from './features/userSlice'
import  categoryReducer from './features/categorySlice'
import  servicesReducer from './features/serviceSlice'
import  packagesReducer from './features/PackagesSlice'
import  ordersRedcuer from './features/ordersSlice'
import  cartReducer from './features/CartSlice'
const store = configureStore({
    reducer:{
        user:userReducer,
        categories:categoryReducer,
        services:servicesReducer,
        packages:packagesReducer,
        orders:ordersRedcuer,
        cart:cartReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }),

})
export default store