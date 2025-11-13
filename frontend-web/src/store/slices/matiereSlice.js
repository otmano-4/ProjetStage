import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// === Exemple de données simulées ===
let fakeMatieres = [
  { id: 1, nom: "Mathématiques", description: "Cours de logique et calcul" },
]

// === Thunk pour récupérer les matières ===
export const fetchMatieres = createAsyncThunk("matieres/fetchMatieres", async () => {
  return fakeMatieres
})

// === Thunk pour créer une matière ===
export const createMatiereFun = createAsyncThunk("matieres/createMatiere", async (matiere) => {
  const newMat = { ...matiere, id: Date.now() }
  fakeMatieres.push(newMat)
  return newMat
})

// === Slice principal ===
const matiereSlice = createSlice({
  name: "matieres",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatieres.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMatieres.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(createMatiereFun.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default matiereSlice.reducer
