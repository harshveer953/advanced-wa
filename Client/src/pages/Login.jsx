import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { token, loading, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) nav("/dashboard");
  }, [token, nav]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-ink-950 flex">

      {/* Left Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-5xl font-bold mb-4">
            Welcome Back
          </h1>

          <p className="text-zinc-300 max-w-md">
            Manage your orders faster with a clean dashboard
            experience and keep everything organized.
          </p>
        </div>
      </div>

      {/* Right Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft">

          <div className="px-6 py-6 border-b border-zinc-800">
            <div className="text-2xl font-bold">
              Login
            </div>

            <div className="text-sm text-zinc-400 mt-1">
              Login to continue
            </div>
          </div>

          <form onSubmit={submit} className="px-6 py-6 grid gap-4">

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@gmail.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••"
            />

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Link
                to="/register"
                className="text-sm text-zinc-400 hover:text-white"
              >
                Create account
              </Link>
            </div>

            {loading && (
              <Loader label="Checking credentials..." />
            )}
          </form>

        </div>
      </div>

    </div>
  );
}