import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/examSlice";
// import userReducer from "./slices/userSlice"; // if you already have this

const store = configureStore({
  reducer: {
    examens: examReducer,
    // user: userReducer,
  },
});

export default store;
