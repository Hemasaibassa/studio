"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function CropSelect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const languageLabel = languages[lang] || "English";

  const [cropType, setCropType] = useState("");

  const handleCropTypeSelect = (type: string) => {
    setCropType(type);
  };

  const handleNext = () => {
    if (cropType) {
      router.push(`/crop-list?lang=${lang}&cropType=${cropType}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Select Crop Type</h1>
      <p className="text-lg mb-4">Language: {languageLabel}</p>

      <Select onValueChange={handleCropTypeSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select crop type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fruit">Fruit</SelectItem>
          <SelectItem value="vegetable">Vegetable</SelectItem>
        </SelectContent>
      </Select>

      <Button disabled={!cropType} onClick={handleNext} className="mt-4">
        Next
      </Button>
    </div>
  );
}
