import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch examens visibles (pour étudiants - filtrés par dates)
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

// Fetch tous les examens (pour professeurs/admins - sans filtre de dates)
export const fetchAllExamens = createAsyncThunk(
  "examens/fetchAllExamens",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/api/examens");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Erreur lors du chargement des examens");
    }
  }
);

// Fetch examens par professeur ID
export const fetchExamensByProfesseur = createAsyncThunk(
  "examens/fetchExamensByProfesseur",
  async (professeurId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/examens/professeur/${professeurId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Erreur lors du chargement des examens du professeur");
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

// Create a question for an exam
export const createQuestionFun = createAsyncThunk(
  "examens/createQuestionFun",
  async ({ examId, question }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/examens/${examId}/questions`,
        question
      );
      return { examId, question: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Erreur lors de l'ajout de la question"
      );
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

      // fetch all examens (pour professeurs)
      .addCase(fetchAllExamens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExamens.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllExamens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch examens par professeur
      .addCase(fetchExamensByProfesseur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamensByProfesseur.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExamensByProfesseur.rejected, (state, action) => {
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
      })


      .addCase(createQuestionFun.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestionFun.fulfilled, (state, action) => {
        state.loading = false;

        // Find the exam in the list
        const exam = state.list.find(e => e.id === action.payload.examId);
        if (exam) {
          if (!exam.questions) exam.questions = [];
          exam.questions.push(action.payload.question);
        }
      })
      .addCase(createQuestionFun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default examSlice.reducer;
