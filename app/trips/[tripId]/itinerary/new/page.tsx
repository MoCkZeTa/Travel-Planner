import { addLocation } from "@/lib/actions/add-location";
import { Button } from "@/components/ui/button";

// Accept both Promise and object for params for deployment compatibility
export default async function NewLocation({
  params,
}: {
  params: { tripId: string };
} | {
  params: Promise<{ tripId: string }>;
}) {
  let tripId: string | undefined;
  if (params && typeof (params as Promise<any>).then === "function") {
    // If params is a Promise (old deployment bug), await it
    const resolved = await (params as Promise<{ tripId: string }>);
    tripId = resolved.tripId;
  } else {
    tripId = (params as { tripId: string })?.tripId;
  }

  if (!tripId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 font-bold text-lg">
          Trip ID is missing from the URL.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            Add New Location
          </h1>
          <form
            className="space-y-6"
            action={async (formData) => {
              "use server";
              await addLocation(formData, tripId!);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                name="address"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full">
              Add Location
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}