import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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

export default function EditTravelPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTravelPlan = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const { data } = await axios.get(`${baseUrl}/travel-plan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const plan = data.travelPlan;

        setTitle(plan.title || "");
        setDestination(plan.destination || "");
        setDuration(plan.duration || "");
        setBudget(plan.budget || "");
        setTravelStyle(plan.travelStyle || "");
        setLanguage(plan.language || "en");
      } catch (err) {
        toastError(err.response?.data?.message || "Failed to load travel plan");
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlan();
  }, [id]);

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

    if (Number(budget) <= 0) {
      toastError("Budget must be greater than 0");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      await axios.put(
        `${baseUrl}/travel-plan/${id}`,
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

      toastSuccess("Travel plan updated successfully!");
      navigate(`/travel-plan/${id}`);
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to update travel plan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F5F6F7]">
        <div className="flex items-center gap-3 text-gray-500">
          <svg
            className="h-6 w-6 animate-spin text-[#1A9FFF]"
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
          Loading travel plan...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A9FFF] via-[#0E7FD4] to-[#0A5FA8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/3 top-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <span>✏️</span>
              Edit Travel Plan
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Update Your Trip
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-50">
              Make changes to your travel plan and keep your adventure up to
              date.
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Trip Details
                </h2>
                <p className="text-sm text-gray-500">
                  Update the details of your trip
                </p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="space-y-8 px-8 py-8">
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
              <Link
                to={`/travel-plan/${id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#0E7FD4]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Travel Plan
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5C1A] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#FF5C1A]/25 transition hover:bg-[#E84E0F] active:bg-[#D6450D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
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
                    Saving...
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Save Changes
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