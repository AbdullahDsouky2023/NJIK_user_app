// categorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { setCategories } from "./categorySlice";
import useServices from "../../../utils/services";

const packageSlice = createSlice({
  name: "packages",
  initialState: { packages: [] },
  reducers: {
    setpackages: (state, action) => {
      state.packages = action.payload;
    },
    // Add other reducers as needed
  },
  
});

export const { setpackages } = packageSlice.actions;
export default packageSlice.reducer;
