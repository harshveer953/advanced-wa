import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));

    if (!result.error) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex">

      {/* Left Image Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600"
          alt="Register"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-10 left-10 z-10 text-white">
          <h1 className="text-5xl font-bold mb-4">
            Join Us Today
          </h1>

          <p className="text-zinc-300 max-w-md leading-relaxed">
            Create your account and unlock a smarter experience with
            powerful tools, personalized features, and seamless access.
          </p>
        </div>

      </div>

      {/* Right Register Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">

        <div className="w-full max-w-md bg-ink-900 border border-zinc-800 rounded-3xl shadow-soft overflow-hidden">

          <div className="px-6 py-6 border-b border-zinc-800">

            <h2 className="text-3xl font-bold text-white">
              Register
            </h2>

            <p className="text-sm text-zinc-400 mt-2">
              Create your account to continue
            </p>

          </div>

          <form
            onSubmit={submit}
            className="px-6 py-6 space-y-4"
          >

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white hover:underline"
              >
                Login
              </Link>
            </div>

            {loading && (
              <Loader label="Creating account..." />
            )}

          </form>

        </div>

      </div>
    </div>
  );
}