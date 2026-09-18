import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes.jsx";
import { hydrateFromStorage, fetchMe } from "./features/auth/authSlice.js";

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(hydrateFromStorage()); }, [dispatch]);

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [dispatch, token, user]);

  return <AppRoutes />;
}
