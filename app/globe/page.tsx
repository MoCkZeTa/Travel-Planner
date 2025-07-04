"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl"; // type-only import, safe for SSR

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set()
  );
  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    function handleResize() {
      const width = Math.min(window.innerWidth - 32, 800); // 32px padding
      const height = Math.min(window.innerHeight * 0.5, 500); // 50vh max 500px
      setGlobeSize({
        width: Math.max(width, 320),
        height: Math.max(height, 240),
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        setLocations(data);
        const countries = new Set<string>(
          data.map((loc: TransformedLocation) => loc.country)
        );
        setVisitedCountries(countries);
      } catch (err) {
        console.error("error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    let animationFrame: number;
    function animate() {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.5;
        globeRef.current.controls().update();
      }
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-3xl sm:text-4xl font-bold mb-8 sm:mb-12">
            Your Travel Journey
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  See where you've been...
                </h2>
                <div className="w-full h-[50vw] max-h-[500px] min-h-[240px] relative flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                    </div>
                  ) : (
                    <Globe
                      ref={globeRef}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                      backgroundColor="rgba(0,0,0,0)"
                      pointColor={() => "#FF5733"}
                      pointLabel="name"
                      pointsData={locations}
                      pointRadius={0.5}
                      pointAltitude={0.1}
                      pointsMerge={true}
                      width={globeSize.width}
                      height={globeSize.height}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Countries Visited</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You've visited{" "}
                          <span className="font-bold">{visitedCountries.size}</span>{" "}
                          countries.
                        </p>
                      </div>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {Array.from(visitedCountries)
                          .sort()
                          .map((country, key) => (
                            <div
                              key={key}
                              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                            >
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span className="font-medium"> {country}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}