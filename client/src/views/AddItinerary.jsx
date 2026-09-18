import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";

const emptyActivity = {
  time: "",
  activity: "",
  location: "",
  description: "",
  estimated_cost_idr: "",
};

export default function AddItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [day, setDay] = useState("");
  const [title, setTitle] = useState("");
  const [activities, setActivities] = useState([{ ...emptyActivity }]);
  const [loading, setLoading] = useState(false);

  function handleActivityChange(index, field, value) {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  }

  function addActivity() {
    setActivities([...activities, { ...emptyActivity }]);
  }

  function removeActivity(index) {
    if (activities.length === 1) {
      toastError("At least one activity is required");
      return;
    }
    setActivities(activities.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!day || !title) {
      toastError("Please fill in the day and title");
      return;
    }

    const hasValidActivity = activities.some(
      (a) => a.activity.trim() !== "",
    );

    if (!hasValidActivity) {
      toastError("Please add at least one activity");
      return;
    }

    const cleanedActivities = activities
      .filter((a) => a.activity.trim() !== "")
      .map((a) => ({
        time: a.time,
        activity: a.activity,
        location: a.location,
        description: a.description,
        estimated_cost_idr: a.estimated_cost_idr
          ? Number(a.estimated_cost_idr)
          : null,
      }));

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        `${baseUrl}/itinerary/${id}`,
        {
          day: Number(day),
          title,
          activities: cleanedActivities,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toastSuccess("Itinerary added successfully!");
      navigate(`/travel-plan/${id}`);
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to add itinerary");
    } finally {
      setLoading(false);
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
              <span>🗓️</span>
              Add Itinerary
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Plan Your Day
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-50">
              Add a detailed day-by-day itinerary with activities, locations,
              and estimated costs.
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
                🗓️
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Itinerary Details
                </h2>
                <p className="text-sm text-gray-500">
                  Fill in the details for this day of your trip
                </p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="space-y-8 px-8 py-8">
            {/* DAY + TITLE */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="day"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Day <span className="text-[#FF5C1A]">*</span>
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
                    id="day"
                    type="number"
                    min="1"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Day Title <span className="text-[#FF5C1A]">*</span>
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
                    placeholder="e.g. Beach Day in Uluwatu"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>
            </div>

            {/* ACTIVITIES */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Activities <span className="text-[#FF5C1A]">*</span>
                  </label>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Add the activities planned for this day
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addActivity}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1A9FFF]/10 px-3 py-2 text-sm font-semibold text-[#0E7FD4] transition hover:bg-[#1A9FFF]/20"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Activity
                </button>
              </div>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1A9FFF] to-[#0A5FA8] text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          Activity {index + 1}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Remove activity"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`time-${index}`}
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Time
                        </label>
                        <input
                          id={`time-${index}`}
                          type="text"
                          value={activity.time}
                          onChange={(e) =>
                            handleActivityChange(index, "time", e.target.value)
                          }
                          placeholder="e.g. 09:00 AM"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:ring-4 focus:ring-[#1A9FFF]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`location-${index}`}
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Location
                        </label>
                        <input
                          id={`location-${index}`}
                          type="text"
                          value={activity.location}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Uluwatu Temple"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:ring-4 focus:ring-[#1A9FFF]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`activity-${index}`}
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Activity <span className="text-[#FF5C1A]">*</span>
                        </label>
                        <input
                          id={`activity-${index}`}
                          type="text"
                          value={activity.activity}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              "activity",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Visit the temple"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:ring-4 focus:ring-[#1A9FFF]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`cost-${index}`}
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Estimated Cost (IDR)
                        </label>
                        <input
                          id={`cost-${index}`}
                          type="number"
                          min="0"
                          value={activity.estimated_cost_idr}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              "estimated_cost_idr",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 50000"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:ring-4 focus:ring-[#1A9FFF]/10"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`description-${index}`}
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Description
                        </label>
                        <textarea
                          id={`description-${index}`}
                          value={activity.description}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe this activity..."
                          rows="2"
                          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:ring-4 focus:ring-[#1A9FFF]/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Add Itinerary
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