import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch examens visibles
export const fetchExamens = createAsyncThunk(
  "examens/fetchExamens",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/api/examens/afficher");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Erreur lors du chargement des examens");
    }
  }
);

// Fetch examens par classe ID
export const fetchExamensByClasse = createAsyncThunk(
  "examens/fetchExamensByClasse",
  async (classeId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/examens/classe/${classeId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Erreur lors du chargement des examens de la classe"
      );
    }
  }
);

// Create a new exam
export const createExamFun = createAsyncThunk(
  "examens/createExamFun",
  async (examData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8080/api/examens", examData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Erreur lors de la création de l'examen");
    }
  }
);

const examSlice = createSlice({
  name: "examens",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetch examens par classe
      .addCase(fetchExamensByClasse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamensByClasse.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExamensByClasse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchExamens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamens.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExamens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create exam
      .addCase(createExamFun.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamFun.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createExamFun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default examSlice.reducer;
