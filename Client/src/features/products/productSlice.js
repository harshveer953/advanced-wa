import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productAPI } from "./productAPI";

const initialState = { list: [], loading: false, error: null };

export const fetchProducts = createAsyncThunk("products/fetch", async (search, thunkAPI) => {
  try {
    const { data } = await productAPI.list(search || "");
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to load products");
  }
});

export const createProduct = createAsyncThunk("products/create", async (payload, thunkAPI) => {
  try {
    const { data } = await productAPI.create(payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to create product");
  }
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, payload }, thunkAPI) => {
  try {
    const { data } = await productAPI.update(id, payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to update product");
  }
});

export const deleteProduct = createAsyncThunk("products/delete", async (id, thunkAPI) => {
  try {
    await productAPI.remove(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to delete product");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: { clearProductError: (state) => { state.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to load products"; })
      .addCase(createProduct.fulfilled, (s, a) => { s.list = [a.payload, ...s.list]; })
      .addCase(updateProduct.fulfilled, (s, a) => { s.list = s.list.map((p) => (p._id === a.payload._id ? a.payload : p)); })
      .addCase(deleteProduct.fulfilled, (s, a) => { s.list = s.list.filter((p) => p._id !== a.payload); })
      .addMatcher(
        (action) => action.type.startsWith("products/") && action.type.endsWith("/rejected"),
        (s, a) => { s.error = a.payload || "Products error"; }
      );
  }
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
