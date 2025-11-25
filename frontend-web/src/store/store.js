import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/examSlice";
import classReducer from "./slices/classSlice";
import utilisateurReducer from "./slices/usersSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    examens: examReducer,
    classes: classReducer,
    utilisateurs: utilisateurReducer
  },
});

export default store;
