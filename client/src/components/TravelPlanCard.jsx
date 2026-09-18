import { Link } from "react-router";

export default function TravelPlanCard({ travelPlan }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {travelPlan.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {travelPlan.destination}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">

        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-gray-500">
            Duration
          </p>

          <p className="font-semibold text-blue-600">
            {travelPlan.duration} days
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-gray-500">
            Budget
          </p>

          <p className="font-semibold text-blue-600">
            Rp{Number(travelPlan.budget).toLocaleString("id-ID")}
          </p>
        </div>

      </div>

      <div className="flex items-center justify-between">

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
          {travelPlan.travelStyle}
        </span>

        <Link
          to={`/travel-plan/${travelPlan.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Detail
        </Link>

      </div>

    </div>
  );
}