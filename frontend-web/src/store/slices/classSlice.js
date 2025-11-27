import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/classes";

// === Fetch all classes ===
export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur lors du chargement des classes");
    }
  }
);

// === Create new class ===
export const createClasse = createAsyncThunk(
  "classes/createClasse",
  async (newClasse, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newClasse, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création de la classe");
    }
  }
);

// === Fetch single class ===
export const fetchClasseById = createAsyncThunk(
  "classes/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur lors du chargement de la classe");
    }
  }
);

// === Add student manually ===
export const addStudentToClasse = createAsyncThunk(
  "classes/addStudent",
  async ({ classeId, student }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${classeId}/students`, student, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // updated class
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur lors de l'ajout de l'élève");
    }
  }
);


// === Add professor manually ===
export const addProfesseurToClasse = createAsyncThunk(
  "classes/addProfesseur",
  async ({ classeId, idProf }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${classeId}/add-professeur/${idProf}`,
        {}, // body can be empty, your API uses path params
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data; // returns updated class
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erreur lors de l'ajout du professeur"
      );
    }
  }
);



// classSlice.js
export const fetchClassesByProfesseur = createAsyncThunk(
  "classes/fetchByProfesseur",
  async (profId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/professeur/${profId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur lors du chargement des classes");
    }
  }
);




const initialState = {
  data: [],
  selectedClasse: null,
  loading: false,
  error: null,
};

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create class
      .addCase(createClasse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClasse.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createClasse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single class
      .addCase(fetchClasseById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedClasse = null;
      })
      .addCase(fetchClasseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClasse = action.payload;
      })
      .addCase(fetchClasseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add student
      .addCase(addStudentToClasse.fulfilled, (state, action) => {
        state.selectedClasse = action.payload;
      })

      .addCase(addProfesseurToClasse.fulfilled, (state, action) => {
        state.selectedClasse = action.payload;
      })



      // inside extraReducers
      .addCase(fetchClassesByProfesseur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassesByProfesseur.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // or a new field like state.classesByProf
      })
      .addCase(fetchClassesByProfesseur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


  },
});

export default classSlice.reducer;
