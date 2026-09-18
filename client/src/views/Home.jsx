import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import TravelPlanCard from "../components/TravelPlanCard";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";

export default function Home() {
  const [travelPlans, setTravelPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${baseUrl}/travel-plan`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTravelPlans(response.data.travelPlan)
      } catch (err) {
        console.log(err);

        toastError(
          err.response?.data?.message || "Failed to load travel plans",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlans();
  }, []);

  const filteredTravelPlans = travelPlans.filter((plan) =>
    plan.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-blue-100">
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="mb-3 font-semibold text-blue-600">
              YOUR PERSONAL TRAVEL PLANNER
            </p>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Plan your next adventure
              <span className="text-blue-600"> with ease.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Create your perfect travel plan manually or let AI build an
              itinerary tailored to your destination, budget, and travel style.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/create-travel-plan"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Travel Plan
              </Link>

              <Link
                to="/generate-travel-plan"
                className="rounded-xl border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                ✨ Generate with AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRAVEL PLANS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Travel Plans
            </h2>

            <p className="mt-1 text-gray-500">
              Your saved travel plans and adventures.
            </p>
          </div>

          <Link
            to="/create-travel-plan"
            className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:block"
          >
            + Create Plan
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-8">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by destination..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:ring-4 focus:ring-[#1A9FFF]/10"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-gray-400 transition hover:text-gray-600"
                title="Clear search"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="py-12 text-center text-gray-500">
            Loading your travel plans...
          </div>
        )}

        {/* EMPTY */}

        {!loading && travelPlans.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">
              No travel plans yet
            </h3>

            <p className="mt-2 text-gray-500">
              Start planning your next adventure.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/create-travel-plan"
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                Create Plan
              </Link>

              <Link
                to="/generate-travel-plan"
                className="rounded-lg border border-blue-600 px-5 py-2.5 font-medium text-blue-600 hover:bg-blue-50"
              >
                ✨ Generate with AI
              </Link>
            </div>
          </div>
        )}

        {/* NO SEARCH RESULTS */}

        {!loading &&
          travelPlans.length > 0 &&
          filteredTravelPlans.length === 0 && (
            <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-4xl">🔍</p>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                No travel plans found
              </h3>
              <p className="mt-2 text-gray-500">
                No plans match "{searchTerm}". Try a different destination.
              </p>
            </div>
          )}

        {/* CARDS */}

        {!loading &&
          travelPlans.length > 0 &&
          filteredTravelPlans.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTravelPlans.map((travelPlan) => (
                <TravelPlanCard key={travelPlan.id} travelPlan={travelPlan} />
              ))}
            </div>
          )}
      </section>
    </div>
  );
}

