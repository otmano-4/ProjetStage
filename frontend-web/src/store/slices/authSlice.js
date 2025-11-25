import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/utilisateurs"; // adjust to your backend login endpoint

// --- LOGIN ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, motDePasse }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        motDePasse,
      });

      // Save user info in localStorage
      localStorage.setItem("utilisateur", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors de la connexion"
      );
    }
  }
);

// --- LOGOUT ---
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("utilisateur");
  return null;
});

const initialState = {
  user: JSON.parse(localStorage.getItem("utilisateur")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("utilisateur", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
