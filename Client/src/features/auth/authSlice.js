import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "./authAPI";

const safeJsonParse = (v) => {
  try { return JSON.parse(v); } catch { return null; }
};

const initialState = { user: null, token: null, loading: false, error: null };

export const hydrateFromStorage = createAsyncThunk("auth/hydrate", async () => {
  const token = localStorage.getItem("token");
  const user = safeJsonParse(localStorage.getItem("user"));
  return { token: token || null, user: user || null };
});

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const { data } = await authAPI.register(payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Register failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await authAPI.login(payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Login failed");
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const { data } = await authAPI.me();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateFromStorage.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Register failed";
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user || state.user;
        if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(fetchMe.rejected, () => {});
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
