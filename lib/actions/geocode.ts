interface GeocodeResult {
  country: string;
  formattedAddress: string;
}

export async function getCountryFromCoordinates(
  lat: number,
  lng: number
): Promise<GeocodeResult> {
  const accessToken = process.env.MAPBOX_API_KEY!;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`
  );

  const data = await response.json();

  const countryFeature = data.features.find((feature: any) =>
    feature.place_type.includes("country")
  );
  const placeFeature = data.features[0];

  return {
    country: countryFeature ? countryFeature.text : "Unknown",
    formattedAddress: placeFeature ? placeFeature.place_name : "Unknown",
  };
}