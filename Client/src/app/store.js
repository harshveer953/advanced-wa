import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productsReducer from "../features/products/productSlice";
import ordersReducer from "../features/orders/orderSlice";
import customersReducer from "../features/customers/customerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    customers: customersReducer
  }
});

export default store;
