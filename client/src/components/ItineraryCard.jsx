export default function ItineraryCard({ itinerary }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-5">
        <span className="text-sm font-semibold text-blue-600">
          Day {itinerary.day}
        </span>

        <h3 className="mt-1 text-xl font-bold text-gray-800">
          {itinerary.title}
        </h3>
      </div>

      <div className="space-y-4">

        {itinerary.activities?.map((activity, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-100 bg-gray-50 p-4"
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm font-medium text-blue-600">
                  {activity.time}
                </p>

                <h4 className="mt-1 font-semibold text-gray-800">
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

              {activity.estimated_cost_idr != null && (
                <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
                  Rp
                  {Number(activity.estimated_cost_idr).toLocaleString(
                    "id-ID"
                  )}
                </span>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}