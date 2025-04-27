"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages, soils } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function SoilSelect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const crop = searchParams.get("crop") || "";
  const languageLabel = languages[lang] || "English";

  const handleSoilSelect = (soilType: string) => {
    router.push(`/weather-analysis?lang=${lang}&crop=${crop}&soil=${soilType}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Select Your Soil Type</h1>
      <p className="text-lg mb-4">Language: {languageLabel}</p>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(soils).map(([key, soil]) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center p-4 border rounded cursor-pointer"
            onClick={() => handleSoilSelect(key)}
          >
            <img src={soil.image} alt={soil.name[lang] || soil.name["en"]} className="w-32 h-32 object-cover rounded mb-2" />
            <p className="text-lg">{soil.name[lang] || soil.name["en"]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
