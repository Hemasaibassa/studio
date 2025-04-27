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
    router.push(`/soil-select?lang=${lang}&crop=${cropKey}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Select Your Crop</h1>
      <div className="grid grid-cols-2 gap-4">
        {filteredCrops.map((crop) => (
          <div
            key={crop.key}
            className="flex flex-col items-center justify-center p-4 border rounded cursor-pointer"
            onClick={() => handleCropSelect(crop.key)}
          >
            <img src={crop.image} alt={crop.name} className="w-32 h-32 object-cover rounded mb-2" />
            <p className="text-lg">{crop.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
