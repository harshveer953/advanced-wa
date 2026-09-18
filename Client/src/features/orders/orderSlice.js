import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderAPI } from "./orderAPI";

const initialState = { list: [], createdOrder: null, loading: false, error: null };

export const fetchOrders = createAsyncThunk("orders/fetch", async (status, thunkAPI) => {
  try {
    const { data } = await orderAPI.list(status || "");
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to load orders");
  }
});

export const createOrderFromText = createAsyncThunk("orders/createFromText", async (payload, thunkAPI) => {
  try {
    const { data } = await orderAPI.createFromText(payload);
    return data; // { message, order }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to create order");
  }
});

export const updateOrderStatus = createAsyncThunk("orders/updateStatus", async ({ id, status }, thunkAPI) => {
  try {
    const { data } = await orderAPI.updateStatus(id, status);
    return data.order;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to update status");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (s) => { s.error = null; },
    clearCreatedOrder: (s) => { s.createdOrder = null; }
  },
  extraReducers: (b) => {
    b.addCase(fetchOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to load orders"; })
      .addCase(createOrderFromText.pending, (s) => { s.loading = true; s.error = null; s.createdOrder = null; })
      .addCase(createOrderFromText.fulfilled, (s, a) => {
        s.loading = false;
        s.createdOrder = a.payload?.order || null;
        if (s.createdOrder) s.list = [s.createdOrder, ...s.list.filter((o) => o._id !== s.createdOrder._id)];
      })
      .addCase(createOrderFromText.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to create order"; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const updated = a.payload;
        s.list = s.list.map((o) => (o._id === updated._id ? updated : o));
        if (s.createdOrder?._id === updated._id) s.createdOrder = updated;
      })
      .addMatcher(
        (action) => action.type.startsWith("orders/") && action.type.endsWith("/rejected"),
        (s, a) => { s.error = a.payload || "Orders error"; }
      );
  }
});

export const { clearOrderError, clearCreatedOrder } = orderSlice.actions;
export default orderSlice.reducer;
