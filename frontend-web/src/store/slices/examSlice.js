import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch examens
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

// Create a new exam
export const createExamFun = createAsyncThunk(
  "examens/createExamFun",
  async (examData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8080/api/examens", examData);
      return res.data; // return the created exam
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
      // fetch examens
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
        state.list.push(action.payload); // add the new exam to the list
      })
      .addCase(createExamFun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default examSlice.reducer;
