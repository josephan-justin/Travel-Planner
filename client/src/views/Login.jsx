import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authslice";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.access_token) {
      navigate("/");
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      toastError("Please input your email / password");
      return;
    }

    try {
      const { data } = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      localStorage.setItem("access_token", data.access_token);

      dispatch(login(data.access_token));

      toastSuccess("Welcome To Travel Planner!");
      navigate("/");
    } catch (error) {
      console.log("Login Error:", error);
      console.log("Response:", error.response);
      toastError(error.response?.data?.message || "Login Failed");
    }
  }

  async function handleGoogleLogin(credentialResponse) {
    try {
      const { data } = await axios.post(
        `${baseUrl}/google-login`,
        {},
        {
          headers: {
            token: credentialResponse.credential,
          },
        },
      );
      localStorage.setItem("access_token", data.access_token);

      dispatch(login(data.access_token));

      toastSuccess("Welcome To Travel Planner!");
      navigate("/");
    } catch (error) {
      console.log("Login Error:", error);
      console.log("Response:", error.response);
      toastError(error.response?.data?.message || "Login Failed");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-blue-50">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* LEFT - BRANDING */}
          <div className="hidden bg-blue-600 lg:flex lg:flex-col lg:justify-between p-12 text-white">
            <div>
              <h1 className="text-3xl font-bold">TravelPlanner</h1>

              <p className="mt-2 text-blue-100">
                Your personal travel planning companion.
              </p>
            </div>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-200">
                Plan. Explore. Enjoy.
              </p>

              <h2 className="text-4xl font-bold leading-tight">
                Plan your next adventure with ease.
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-blue-100">
                Create personalized travel plans, organize your itinerary, and
                let AI help you discover your next adventure.
              </p>
            </div>

            <p className="text-sm text-blue-200">©️ 2026 TravelPlanner</p>
          </div>

          {/* RIGHT - LOGIN FORM */}
          <div className="flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
              {/* MOBILE LOGO */}
              <div className="mb-10 lg:hidden">
                <h1 className="text-3xl font-bold text-blue-600">
                  TravelPlanner
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Your personal travel planning companion.
                </p>
              </div>

              {/* HEADER */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-gray-500">
                  Sign in to continue planning your adventures.
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="cursor-pointer w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
                >
                  Login
                </button>
              </form>

              {/* REGISTER */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign Up
                </button>
              </p>
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-sm text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="flex justify-center items-center">
                <GoogleLogin onSuccess={handleGoogleLogin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
