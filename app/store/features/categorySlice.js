// categorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import serviceSlice from "./serviceSlice";

const categorySlice = createSlice({
  name: "categories",
  initialState: { categories: [] ,banners:[]},
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBanners: (state, action) => {
      state.banners = action.payload;
    },
    // Add other reducers as needed
  },
 
});

export const { setCategories ,setBanners} = categorySlice.actions;
export default categorySlice.reducer;
