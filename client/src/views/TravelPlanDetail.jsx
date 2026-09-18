import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";

export default function TravelPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [travelPlan, setTravelPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);

  useEffect(() => {
    const fetchTravelPlan = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const { data } = await axios.get(`${baseUrl}/travel-plan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTravelPlan(data.travelPlan);
      } catch (err) {
        toastError(err.response?.data?.message || "Failed to load travel plan");
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlan();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this travel plan?")) {
      return;
    }

    setDeleting(true);

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(`${baseUrl}/travel-plan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toastSuccess("Travel plan deleted successfully!");
      navigate("/");
    } catch (error) {
      toastError(
        error.response?.data?.message || "Failed to delete travel plan",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdateItinerary(e) {
    e.preventDefault();

    if (!editingItinerary?.day || !editingItinerary?.title?.trim()) {
      toastError("Day and title are required");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const { data } = await axios.put(
        `${baseUrl}/itinerary/${editingItinerary.id}`,
        {
          day: Number(editingItinerary.day),
          title: editingItinerary.title,
          activities: editingItinerary.activities || [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTravelPlan((prev) => ({
        ...prev,
        Itineraries: prev.Itineraries.map((item) =>
          item.id === editingItinerary.id ? data.itinerary : item,
        ),
      }));

      setEditingItinerary(null);
      toastSuccess("Itinerary updated successfully!");
    } catch (error) {
      console.log("UPDATE ITINERARY ERROR:", error);
      toastError(
        error.response?.data?.message || "Failed to update itinerary",
      );
    }
  }

  async function handleDeleteItinerary(itineraryId) {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(`${baseUrl}/itinerary/${itineraryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTravelPlan((prev) => ({
        ...prev,
        Itineraries: prev.Itineraries.filter(
          (item) => item.id !== itineraryId,
        ),
      }));

      if (editingItinerary?.id === itineraryId) {
        setEditingItinerary(null);
      }

      toastSuccess("Itinerary deleted successfully!");
    } catch (error) {
      console.log("DELETE ITINERARY ERROR:", error);
      toastError(
        error.response?.data?.message || "Failed to delete itinerary",
      );
    }
  }

  function updateEditingActivity(index, field, value) {
    setEditingItinerary((prev) => ({
      ...prev,
      activities: prev.activities.map((activity, activityIndex) =>
        activityIndex === index
          ? { ...activity, [field]: value }
          : activity,
      ),
    }));
  }

  function addEditingActivity() {
    setEditingItinerary((prev) => ({
      ...prev,
      activities: [
        ...(prev.activities || []),
        {
          time: "",
          activity: "",
          location: "",
          description: "",
          estimated_cost_idr: "",
        },
      ],
    }));
  }

  function removeEditingActivity(index) {
    setEditingItinerary((prev) => ({
      ...prev,
      activities: prev.activities.filter(
        (_, activityIndex) => activityIndex !== index,
      ),
    }));
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

  if (!travelPlan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F5F6F7] px-6">
        <div className="text-center">
          <p className="text-4xl">🗺️</p>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Travel plan not found
          </h1>
          <p className="mt-2 text-gray-500">
            The travel plan you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-[#1A9FFF] px-6 py-3 font-semibold text-white transition hover:bg-[#0E7FD4]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const hasItinerary = travelPlan.Itineraries?.length > 0;
  const hasBudgetBreakdown = travelPlan.budgetBreakdown?.categories?.length > 0;
  const hasTravelTips = travelPlan.travelTips?.length > 0;

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
              <span>📍</span>
              {travelPlan.destination}
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              {travelPlan.title}
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-50">
              {travelPlan.duration} days of adventure • {travelPlan.travelStyle}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-6 pb-16">
        {/* OVERVIEW CARD */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-900/5">
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Duration
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {travelPlan.duration}{" "}
                <span className="text-sm font-medium text-gray-500">days</span>
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Budget
              </p>
              <p className="mt-1 text-xl font-bold text-[#0E7FD4]">
                Rp
                {Number(travelPlan.budget).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Travel Style
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {travelPlan.travelStyle}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Language
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {travelPlan.language === "id" ? "🇮🇩 Indonesia" : "🇬🇧 English"}
              </p>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex flex-wrap gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <Link
              to={`/edit-travel-plan/${travelPlan.id}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5C1A] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF5C1A]/20 transition hover:bg-[#E84E0F]"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Plan
            </Link>

            <a
              href={`${baseUrl}/travel-plan/${travelPlan.id}/export?access_token=${localStorage.getItem(
                "access_token",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#1A9FFF] bg-white px-5 py-2.5 text-sm font-semibold text-[#0E7FD4] transition hover:bg-[#1A9FFF]/5"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export PDF
            </a>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
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
                  Deleting...
                </>
              ) : (
                <>
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

        {/* ITINERARY */}
        {hasItinerary && (
          <div className="mt-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A9FFF]/10 text-[#1A9FFF]">
                🗓️
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Itinerary
                </h2>
                <p className="text-sm text-gray-500">
                  Day-by-day plan for your trip
                </p>
              </div>
            </div>

            <div className="relative space-y-6 before:absolute before:inset-y-2 before:left-[27px] before:w-0.5 before:bg-[#1A9FFF]/20">
              {travelPlan.Itineraries.map((itinerary) => (
                <div key={itinerary.id} className="relative flex gap-5">
                  {/* DAY BADGE */}
                  <div className="z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A9FFF] to-[#0A5FA8] text-white shadow-lg shadow-[#1A9FFF]/25">
                    <span className="text-[10px] font-medium uppercase leading-none text-blue-100">
                      Day
                    </span>
                    <span className="text-lg font-bold leading-tight">
                      {itinerary.day}
                    </span>
                  </div>

                  {/* DAY CONTENT */}
                  <div className="flex-1 overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {itinerary.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItinerary({
                              ...itinerary,
                              activities: (itinerary.activities || []).map(
                                (activity) => ({ ...activity }),
                              ),
                            })
                          }
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0E7FD4] transition hover:bg-[#1A9FFF]/10"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 px-6 py-5">
                      {itinerary.activities?.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#1A9FFF]/30 hover:bg-[#1A9FFF]/5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0E7FD4] shadow-sm">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
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

                            <h4 className="mt-1 font-semibold text-gray-900">
                              {activity.activity}
                            </h4>

                            {activity.location && (
                              <p className="mt-1 text-sm text-gray-500">
                                📍 {activity.location}
                              </p>
                            )}

                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT ITINERARY */}
        {editingItinerary && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Itinerary
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update the day, title, and activities.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingItinerary(null)}
                className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateItinerary} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItinerary.day}
                    onChange={(e) =>
                      setEditingItinerary((prev) => ({
                        ...prev,
                        day: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#1A9FFF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingItinerary.title}
                    onChange={(e) =>
                      setEditingItinerary((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#1A9FFF]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Activities</h4>
                    <p className="text-sm text-gray-500">
                      Edit or add activities.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addEditingActivity}
                    className="rounded-xl bg-[#1A9FFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0E7FD4]"
                  >
                    + Add Activity
                  </button>
                </div>

                <div className="space-y-4">
                  {(editingItinerary.activities || []).map(
                    (activity, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-700">
                            Activity {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeEditingActivity(index)}
                            className="text-sm font-semibold text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-600">
                              Time
                            </label>
                            <input
                              type="text"
                              value={activity.time || ""}
                              onChange={(e) =>
                                updateEditingActivity(
                                  index,
                                  "time",
                                  e.target.value,
                                )
                              }
                              placeholder="10:00"
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#1A9FFF]"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-600">
                              Activity
                            </label>
                            <input
                              type="text"
                              value={activity.activity || ""}
                              onChange={(e) =>
                                updateEditingActivity(
                                  index,
                                  "activity",
                                  e.target.value,
                                )
                              }
                              placeholder="Visit Kuta Beach"
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#1A9FFF]"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-600">
                              Location
                            </label>
                            <input
                              type="text"
                              value={activity.location || ""}
                              onChange={(e) =>
                                updateEditingActivity(
                                  index,
                                  "location",
                                  e.target.value,
                                )
                              }
                              placeholder="Kuta"
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#1A9FFF]"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-600">
                              Estimated Cost (IDR)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={activity.estimated_cost_idr ?? ""}
                              onChange={(e) =>
                                updateEditingActivity(
                                  index,
                                  "estimated_cost_idr",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                )
                              }
                              placeholder="50000"
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#1A9FFF]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="mb-2 block text-xs font-semibold text-gray-600">
                              Description
                            </label>
                            <textarea
                              rows="3"
                              value={activity.description || ""}
                              onChange={(e) =>
                                updateEditingActivity(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Enjoy the beach..."
                              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#1A9FFF]"
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  )}

                  {(editingItinerary.activities || []).length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 px-6 py-8 text-center">
                      <p className="text-sm text-gray-500">
                        No activities yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setEditingItinerary(null)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#1A9FFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0E7FD4]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* NO ITINERARY */}
        {!hasItinerary && (
          <div className="mt-10 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-4xl">🗓️</p>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No itinerary yet
            </h3>
            <p className="mt-2 text-gray-500">
              This travel plan doesn't have a detailed itinerary yet.
            </p>
            <Link
              to={`/travel-plan/${travelPlan.id}/add-itinerary`}
              className="mt-6 inline-block rounded-xl bg-[#1A9FFF] px-6 py-3 font-semibold text-white transition hover:bg-[#0E7FD4]"
            >
              Add Itinerary
            </Link>
          </div>
        )}

        {/* BUDGET BREAKDOWN */}
        {hasBudgetBreakdown && (
          <div className="mt-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A9FFF]/10 text-[#1A9FFF]">
                💰
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Budget Breakdown
                </h2>
                <p className="text-sm text-gray-500">Where your money goes</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <p className="text-sm font-semibold text-gray-500">
                  Total Budget
                </p>
                <p className="text-xl font-bold text-[#0E7FD4]">
                  {travelPlan.budgetBreakdown.currency === "IDR" ? "Rp" : "$"}
                  {Number(
                    travelPlan.budgetBreakdown.total_budget,
                  ).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="px-6 py-5">
                <div className="space-y-4">
                  {travelPlan.budgetBreakdown.categories.map(
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
                                  travelPlan.budgetBreakdown.total_budget) *
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
            </div>
          </div>
        )}

        {/* TRAVEL TIPS */}
        {hasTravelTips && (
          <div className="mt-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A9FFF]/10 text-[#1A9FFF]">
                💡
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Travel Tips</h2>
                <p className="text-sm text-gray-500">
                  Handy advice for your trip
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="space-y-3 px-6 py-6">
                {travelPlan.travelTips.map((tip, index) => (
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
            Back to Travel Plans
          </Link>
        </div>
      </section>
    </div>
  );
}