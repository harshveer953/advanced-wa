import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import App from "./App.jsx";
import store from "./app/store.js";
import { setOnUnauthorized } from "./services/api.js";
import { logout } from "./features/auth/authSlice.js";

setOnUnauthorized(() => {
  store.dispatch(logout());
  window.location.href = "/login";
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
