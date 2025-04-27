"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Location, Weather, getWeather } from "@/services/weather";

export default function WeatherAnalysis() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const crop = searchParams.get("crop") || "";
  const soil = searchParams.get("soil") || "";
  const languageLabel = languages[lang] || "English";

  const [leafImage, setLeafImage] = useState<string | null>(null);
  const [soilImage, setSoilImage] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      getWeather(location).then(setWeather);
    }
  }, [location]);

  const handleLeafImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeafImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoilImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSoilImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (leafImage && soilImage && weather) {
      router.push(
        `/analysis?lang=${lang}&crop=${crop}&soil=${soil}&leafImage=${encodeURIComponent(
          leafImage
        )}&soilImage=${encodeURIComponent(soilImage)}&temperature=${weather.temperatureCelsius}&conditions=${weather.conditions}&humidity=${weather.humidity}&windSpeed=${weather.windSpeedKph}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Weather Analysis &amp; Image Upload</h1>
      <p className="text-lg mb-4">Language: {languageLabel}</p>

      {weather && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
          <p>Temperature: {weather.temperatureCelsius}°C</p>
          <p>Conditions: {weather.conditions}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeedKph} km/h</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Leaf Image</h2>
          <Input type="file" accept="image/*" onChange={handleLeafImageUpload} />
          {leafImage && <img src={leafImage} alt="Leaf" className="w-32 h-32 object-cover rounded mt-2" />}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Soil Analysis Image</h2>
          <Input type="file" accept="image/*" onChange={handleSoilImageUpload} />
          {soilImage && <img src={soilImage} alt="Soil" className="w-32 h-32 object-cover rounded mt-2" />}
        </div>
        <Button disabled={!leafImage || !soilImage || !weather} onClick={handleAnalyze}>
          Analyze
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push("/")}>Home</Button>
        <Button variant="ghost">Newsletters</Button>
        <Button variant="ghost">Your Crops</Button>
        <Button variant="ghost">Profile</Button>
      </div>
    </div>
  );
}
