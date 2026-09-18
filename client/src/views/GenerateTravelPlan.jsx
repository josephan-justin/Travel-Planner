import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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

export default function GenerateTravelPlan() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [language, setLanguage] = useState("en");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [travelPlans, setTravelPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const { data } = await axios.get(`${baseUrl}/travel-plan`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTravelPlans(data.travelPlan);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTravelPlans();
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();

    if (!destination || !duration || !budget || !travelStyle) {
      toastError("Please complete all required fields");
      return;
    }

    setGenerating(true);
    setGenerated(null);

    try {
      const token = localStorage.getItem("access_token");

      const { data } = await axios.post(
        `${baseUrl}/travel-plan/generate`,
        {
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

      setGenerated(data.travelPlan);
      toastSuccess("Travel plan generated successfully!");
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to generate travel plan");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveAsNew() {
    if (!generated) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        `${baseUrl}/travel-plan/save`,
        {
          trip_title: generated.trip_title,
          destination: generated.destination,
          duration: generated.duration,
          travel_style: generated.travel_style,
          language,
          itinerary: generated.itinerary,
          budget_breakdown: generated.budget_breakdown,
          travel_tips: generated.travel_tips,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toastSuccess("Saved as a new travel plan!");
      navigate("/");
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to save travel plan");
    } finally {
      setSaving(false);
    }
  }

  async function handleReplace() {
    if (!generated) return;

    if (!selectedPlanId) {
      toastError("Please select a travel plan to replace");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      // 1. Update the travel plan with generated data
      await axios.put(
        `${baseUrl}/travel-plan/${selectedPlanId}`,
        {
          title: generated.trip_title,
          destination: generated.destination,
          duration: Number(generated.duration),
          budget: generated.budget_breakdown?.total_budget || Number(budget),
          travelStyle: generated.travel_style,
          language,
          budgetBreakdown: generated.budget_breakdown,
          travelTips: generated.travel_tips,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 2. Get existing itineraries
      const { data: itineraryData } = await axios.get(
        `${baseUrl}/itinerary/${selectedPlanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 3. Delete existing itineraries
      for (const itinerary of itineraryData.itineraries) {
        await axios.delete(`${baseUrl}/itinerary/${itinerary.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // 4. Create new itineraries from generated data
      for (const item of generated.itinerary) {
        await axios.post(
          `${baseUrl}/itinerary/${selectedPlanId}`,
          {
            day: item.day,
            title: item.title,
            activities: item.activities,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      toastSuccess("Travel plan replaced successfully!");
      navigate(`/travel-plan/${selectedPlanId}`);
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to replace travel plan");
    } finally {
      setSaving(false);
    }
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
              <span>✨</span>
              Generate with AI
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Let AI Plan Your Trip
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-50">
              Describe your dream trip and let AI build a complete itinerary
              with budget breakdown and travel tips.
            </p>
          </div>
        </div>
      </section>

      {/* GENERATE FORM */}
      <section className="relative z-10 mx-auto -mt-10 max-w-4xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-900/5">
          <div className="border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A9FFF]/10 text-[#1A9FFF]">
                ✨
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Trip Preferences
                </h2>
                <p className="text-sm text-gray-500">
                  Tell us what kind of trip you want
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8 px-8 py-8">
            {/* DESTINATION + DURATION */}
            <div className="grid gap-6 md:grid-cols-2">
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
            </div>

            {/* BUDGET + TRAVEL STYLE */}
            <div className="grid gap-6 md:grid-cols-2">
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Travel Style <span className="text-[#FF5C1A]">*</span>
                </label>

                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 outline-none transition focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                >
                  <option value="">Select travel style</option>
                  {travelStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
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

            {/* GENERATE BUTTON */}
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI will create a complete itinerary for you.
              </div>

              <button
                type="submit"
                disabled={generating}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5C1A] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#FF5C1A]/25 transition hover:bg-[#E84E0F] active:bg-[#D6450D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating ? (
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
                    Generating...
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* GENERATED RESULT */}
        {generated && (
          <div className="mt-10">
            {/* RESULT HEADER */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A9FFF]/10 text-[#1A9FFF]">
                🗺️
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Generated Travel Plan
                </h2>
                <p className="text-sm text-gray-500">
                  Review your AI-generated itinerary below
                </p>
              </div>
            </div>

            {/* RESULT CARD */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-900/5">
              <div className="border-b border-gray-100 px-8 py-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {generated.trip_title}
                </h3>
                <p className="mt-1 text-gray-500">
                  📍 {generated.destination} • {generated.duration} days •{" "}
                  {generated.travel_style}
                </p>
              </div>

              {/* ITINERARY */}
              <div className="px-8 py-6">
                <h4 className="mb-4 text-lg font-bold text-gray-900">
                  🗓️ Itinerary
                </h4>

                <div className="space-y-6">
                  {generated.itinerary.map((item) => (
                    <div
                      key={item.day}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A9FFF] to-[#0A5FA8] text-sm font-bold text-white">
                          {item.day}
                        </div>
                        <h5 className="font-bold text-gray-900">
                          {item.title}
                        </h5>
                      </div>

                      <div className="space-y-3">
                        {item.activities?.map((activity, index) => (
                          <div
                            key={index}
                            className="rounded-xl bg-white p-4 shadow-sm"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-[#0E7FD4]">
                                {activity.time}
                              </p>
                              {activity.estimated_cost_idr != null && (
                                <span className="rounded-full bg-[#1A9FFF]/10 px-3 py-1 text-xs font-semibold text-[#0E7FD4]">
                                  Rp
                                  {Number(
                                    activity.estimated_cost_idr,
                                  ).toLocaleString("id-ID")}
                                </span>
                              )}
                            </div>
                            <h6 className="mt-1 font-semibold text-gray-900">
                              {activity.activity}
                            </h6>
                            {activity.location && (
                              <p className="mt-1 text-sm text-gray-500">
                                📍 {activity.location}
                              </p>
                            )}
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BUDGET BREAKDOWN */}
              {generated.budget_breakdown && (
                <div className="border-t border-gray-100 px-8 py-6">
                  <h4 className="mb-4 text-lg font-bold text-gray-900">
                    💰 Budget Breakdown
                  </h4>

                  <div className="mb-4 flex items-center justify-between rounded-xl bg-[#1A9FFF]/5 px-5 py-4">
                    <p className="text-sm font-semibold text-gray-600">
                      Total Budget
                    </p>
                    <p className="text-xl font-bold text-[#0E7FD4]">
                      {generated.budget_breakdown.currency === "IDR"
                        ? "Rp"
                        : "$"}
                      {Number(
                        generated.budget_breakdown.total_budget,
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {generated.budget_breakdown.categories?.map(
                      (category, index) => (
                        <div key={index}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-700">
                              {category.category}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              Rp
                              {Number(category.estimated_cost).toLocaleString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#1A9FFF] to-[#0A5FA8]"
                              style={{
                                width: `${
                                  (category.estimated_cost /
                                    generated.budget_breakdown.total_budget) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          {category.details && (
                            <p className="mt-1 text-xs text-gray-500">
                              {category.details}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* TRAVEL TIPS */}
              {generated.travel_tips?.length > 0 && (
                <div className="border-t border-gray-100 px-8 py-6">
                  <h4 className="mb-4 text-lg font-bold text-gray-900">
                    💡 Travel Tips
                  </h4>

                  <div className="space-y-3">
                    {generated.travel_tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4"
                      >
                        <span className="text-lg">💡</span>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SAVE OPTIONS */}
              <div className="border-t border-gray-100 bg-gray-50 px-8 py-6">
                <h4 className="mb-4 text-lg font-bold text-gray-900">
                  💾 Save This Plan
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* SAVE AS NEW */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xl">🆕</span>
                      <h5 className="font-bold text-gray-900">
                        Save as New Plan
                      </h5>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">
                      Create a brand new travel plan with this generated
                      itinerary.
                    </p>
                    <button
                      onClick={handleSaveAsNew}
                      disabled={saving}
                      className="w-full cursor-pointer rounded-xl bg-[#1A9FFF] px-4 py-3 font-semibold text-white transition hover:bg-[#0E7FD4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save as New Plan"}
                    </button>
                  </div>

                  {/* REPLACE EXISTING */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xl">🔄</span>
                      <h5 className="font-bold text-gray-900">
                        Replace Existing Plan
                      </h5>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">
                      Overwrite an existing travel plan and its itinerary with
                      this generated one.
                    </p>

                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="mb-3 w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                    >
                      <option value="">Select a plan to replace...</option>
                      {travelPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title} ({plan.destination})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleReplace}
                      disabled={saving || !selectedPlanId}
                      className="w-full cursor-pointer rounded-xl bg-[#FF5C1A] px-4 py-3 font-semibold text-white transition hover:bg-[#E84E0F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Replacing..." : "Replace Plan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#1A9FFF]/40 hover:text-[#0E7FD4]"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}