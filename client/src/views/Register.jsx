import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [navigate]);

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !username ||
      !email ||
      !password ||
      !fullName ||
      !address ||
      !phone ||
      !birthDate ||
      !gender
    ) {
      toastError("Please complete all fields");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Password do not match");
      return;
    }
    try {
      await axios.post(`${baseUrl}/register`, {
        username,
        email,
        password,
        fullName,
        address,
        phone,
        birthDate,
        gender,
      });
      navigate("/login");
      toastSuccess("Register success! Please Login to your account");
    } catch (error) {
      toastError(error.response?.data?.message || "Register Failed");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-blue-50">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* LEFT - BRANDING */}
          <div className="hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">TravelPlanner</h1>

              <p className="mt-2 text-blue-100">
                Your personal travel planning companion.
              </p>
            </div>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-200">
                Start Your Journey
              </p>

              <h2 className="text-4xl font-bold leading-tight">
                Create your account and start planning.
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-blue-100">
                Save your travel plans, organize your itinerary, and discover
                new adventures with TravelPlanner.
              </p>
            </div>

            <p className="text-sm text-blue-200">© 2026 TravelPlanner</p>
          </div>

          {/* RIGHT - REGISTER FORM */}
          <div className="flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-2xl">
              {/* MOBILE LOGO */}
              <div className="mb-8 lg:hidden">
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
                  Create your account
                </h2>

                <p className="mt-2 text-gray-500">
                  Join TravelPlanner and start planning your next adventure.
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleRegister} className="space-y-5">
                {/* USERNAME + FULL NAME */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid gap-5 md:grid-cols-2">
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
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
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
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    rows="3"
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* BIRTH DATE + GENDER */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="birthDate"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Birth Date
                    </label>

                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>

                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="disabled">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
                >
                  Create Account
                </button>
              </form>

              {/* LOGIN */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
