import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";

const travelStyles = [
  "Adventure",
  "Relaxation",
  "Cultural",
  "Foodie",
  "Luxury",
  "Backpacker",
  "Family",
];

export default function CreateTravelPlan() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !destination || !duration || !budget || !travelStyle) {
      toastError("Please complete all required fields");
      return;
    }

    if (Number(duration) <= 0) {
      toastError("Duration must be greater than 0");
      return;
    }

    if (Number(budget) < 100000) {
      toastError("Budget must be at least  Rp 100,000");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const {data} = await axios.post(
        `${baseUrl}/travel-plan`,
        {
          title,
          destination,
          duration: Number(duration),
          budget: Number(budget),
          travelStyle,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toastSuccess("Travel plan created successfully!");
      navigate("/");
    } catch (error) {
      console.log("CREATE TRAVEL PLAN ERROR:", error);
      console.log("RESPONSE:", error.response?.data);
      toastError(
        error.response?.data?.message || "Failed to create travel plan",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A9FFF] via-[#0E7FD4] to-[#0A5FA8]">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/3 top-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <span>✈️</span>
              Plan Your Journey
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Create Your Travel Plan
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-50">
              Tell us where you want to go and how you like to travel. We'll
              help you organize the perfect adventure.
            </p>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="relative z-10 mx-auto -mt-10 max-w-4xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-900/5">
          {/* FORM HEADER */}
          <div className="border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A9FFF]/10 text-[#1A9FFF]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Trip Details
                </h2>
                <p className="text-sm text-gray-500">
                  Fill in the details of your upcoming trip
                </p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="space-y-8 px-8 py-6">
            {/* TIPS CARD */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A9FFF]/10 text-lg">
                  📍
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Pick a destination
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Choose where your adventure begins
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A9FFF]/10 text-lg">
                  💰
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Set your budget
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Plan your spending with confidence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A9FFF]/10 text-lg">
                  🎒
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Choose your style
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Travel the way you love most
                  </p>
                </div>
              </div>
            </div>
            {/* TITLE + DESTINATION */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Trip Title <span className="text-[#FF5C1A]">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bali Island Hopping"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Destination <span className="text-[#FF5C1A]">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Bali, Indonesia"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>
            </div>

            {/* DURATION + BUDGET */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Duration (days) <span className="text-[#FF5C1A]">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Budget (IDR) <span className="text-[#FF5C1A]">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <input
                    id="budget"
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 5000000"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>
            </div>

            {/* TRAVEL STYLE */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Travel Style <span className="text-[#FF5C1A]">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {travelStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                      travelStyle === style
                        ? "border-[#1A9FFF] bg-[#1A9FFF]/5 text-[#0E7FD4] ring-4 ring-[#1A9FFF]/10"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#1A9FFF]/40 hover:bg-gray-50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Language
              </label>

              <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-medium transition ${
                    language === "en"
                      ? "bg-[#1A9FFF] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇬🇧 English
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("id")}
                  className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-medium transition ${
                    language === "id"
                      ? "bg-[#1A9FFF] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇮🇩 Indonesia
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="h-4 w-4 text-[#1A9FFF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                You can add itinerary details after creating the plan.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5C1A] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#FF5C1A]/25 transition hover:bg-[#E84E0F] active:bg-[#D6450D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create Travel Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
