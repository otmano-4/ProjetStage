import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/utilisateurs";

// === Fetch all users ===
export const fetchUtilisateurs = createAsyncThunk(
  "utilisateurs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors du chargement des utilisateurs"
      );
    }
  }
);

// === Create new user ===
export const createUtilisateur = createAsyncThunk(
  "utilisateurs/create",
  async (newUser, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/inscription`, newUser, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors de la création de l'utilisateur"
      );
    }
  }
);

// === Fetch single user ===
export const fetchUtilisateurById = createAsyncThunk(
  "utilisateurs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors du chargement de l'utilisateur"
      );
    }
  }
);

// === Delete user ===
export const deleteUtilisateur = createAsyncThunk(
  "utilisateurs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors de la suppression"
      );
    }
  }
);

const initialState = {
  data: [],
  selectedUtilisateur: null,
  loading: false,
  error: null,
};

const utilisateurSlice = createSlice({
  name: "utilisateurs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch all
      .addCase(fetchUtilisateurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUtilisateurs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUtilisateurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createUtilisateur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUtilisateur.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createUtilisateur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchUtilisateurById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedUtilisateur = null;
      })
      .addCase(fetchUtilisateurById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUtilisateur = action.payload;
      })
      .addCase(fetchUtilisateurById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteUtilisateur.fulfilled, (state, action) => {
        state.data = state.data.filter((u) => u.id !== action.payload);
      });
  },
});

export default utilisateurSlice.reducer;
