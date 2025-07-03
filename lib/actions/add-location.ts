"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Geocode address using Mapbox API
async function geocodeAddress(address: string) {
  const apiKey = process.env.MAPBOX_API_KEY!;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${apiKey}`
  );
  const data = await response.json();
  if (!data.features || !data.features[0]) {
    console.error("Mapbox geocode error:", JSON.stringify(data));
    throw new Error("No results found for the given address.");
  }
  const [lng, lat] = data.features[0].center;
  return { lat, lng };
}

// export async function addLocation(formData: FormData, tripId: string) {
//   try {
//     const session = await auth();
//     if (!session) {
//       throw new Error("Not authenticated");
//     }

//     const address = formData.get("address")?.toString();
//     if (!address) {
//       throw new Error("Missing address");
//     }

//     const { lat, lng } = await geocodeAddress(address);

//     const count = await prisma.location.count({
//       where: { tripId },
//     });

//     await prisma.location.create({
//       data: {
//         locationTitle: address,
//         lat,
//         lng,
//         tripId,
//         order: count,
//       },
//     });

//     redirect(`/trips/${tripId}`);
//   } catch (error: any) {
//     console.error("addLocation error:", error);
//     // Send error to client for debugging
//     throw new Error(error?.message || "Unknown error in addLocation");
//   }
// }



export async function addLocation(formData: FormData): Promise<void> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const address = formData.get("address")?.toString();
    const tripId = formData.get("tripId")?.toString();

    if (!address || !tripId) {
      throw new Error("Missing address or tripId");
    }

    const { lat, lng } = await geocodeAddress(address);

    const count = await prisma.location.count({
      where: { tripId },
    });

    await prisma.location.create({
      data: {
        locationTitle: address,
        lat,
        lng,
        tripId,
        order: count,
      },
    });

    // ✅ No redirect here — it's now handled in the client
  } catch (error: any) {
    console.error("addLocation error:", error);
    throw new Error(error?.message || "Unknown error in addLocation");
  }
}


