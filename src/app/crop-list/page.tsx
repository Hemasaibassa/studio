"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages, crops } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function CropList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const cropType = searchParams.get("cropType") || "";

  const filteredCrops = Object.entries(crops)
    .filter(([key, crop]) => crop.type === cropType)
    .map(([key, crop]) => ({
      key,
      name: crop.name[lang] || crop.name["en"],
      image: crop.image,
    }));

  const handleCropSelect = (cropKey: string) => {
    router.push(`/weather-analysis?lang=${lang}&crop=${cropKey}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4 text-white">{languages[lang]?.selectYourCrop || "Select Your Crop"}</h1>
      <div className="grid grid-cols-2 gap-4">
        {filteredCrops.map((crop) => (
          <div
            key={crop.key}
            className="flex flex-col items-center justify-center p-4 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleCropSelect(crop.key)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <img src={crop.image} alt={crop.name} className="w-32 h-32 object-cover rounded-md mb-2" style={{ borderRadius: '1rem' }} />
            <p className="text-lg">{crop.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
