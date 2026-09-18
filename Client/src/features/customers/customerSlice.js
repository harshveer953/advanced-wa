import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customerAPI } from "./customerAPI";

const initialState = { list: [], selected: null, loading: false, error: null };

export const fetchCustomers = createAsyncThunk("customers/fetch", async (search, thunkAPI) => {
  try {
    const { data } = await customerAPI.list(search || "");
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to load customers");
  }
});

export const fetchCustomerByPhone = createAsyncThunk("customers/byPhone", async (phone, thunkAPI) => {
  try {
    const { data } = await customerAPI.byPhone(phone);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Customer not found");
  }
});

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomerError: (s) => { s.error = null; },
    clearSelectedCustomer: (s) => { s.selected = null; }
  },
  extraReducers: (b) => {
    b.addCase(fetchCustomers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCustomers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchCustomers.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to load customers"; })
      .addCase(fetchCustomerByPhone.pending, (s) => { s.loading = true; s.error = null; s.selected = null; })
      .addCase(fetchCustomerByPhone.fulfilled, (s, a) => { s.loading = false; s.selected = a.payload; })
      .addCase(fetchCustomerByPhone.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Customer not found"; });
  }
});

export const { clearCustomerError, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
