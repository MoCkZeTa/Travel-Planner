"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Map, { Marker } from "react-map-gl/maplibre";
import type { Location } from "@/app/generated/prisma";

interface MapProps {
  itineraries: Location[];
}

export default function MapboxMap({ itineraries }: MapProps) {
  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Map
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 12, // Increased zoom for more sensitivity
          pitch: 30, // Optional: adds a 3D tilt effect
          bearing: 0, // Optional: map rotation
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        dragPan={true}
        dragRotate={true}
        scrollZoom={true}
        doubleClickZoom={true}
        touchZoomRotate={true}
      >
        {itineraries.map((location, key) => (
          <Marker
            key={key}
            longitude={location.lng}
            latitude={location.lat}
            anchor="bottom"
          >
            {/* Classic sharp red map pin SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
            >
              <path
                d="M12 2C7.48 2 4 5.48 4 10c0 5.25 7.11 11.61 7.44 11.89a1 1 0 0 0 1.12 0C12.89 21.61 20 15.25 20 10c0-4.52-3.48-8-8-8zm0 11.5A3.5 3.5 0 1 1 12 6.5a3.5 3.5 0 0 1 0 7z"
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="1"
              />
              <circle cx="12" cy="10" r="2" fill="#fff" />
            </svg>
          </Marker>
        ))}
      </Map>
    </div>
  );
}