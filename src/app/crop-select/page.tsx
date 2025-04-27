"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";

export default function CropSelect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [cropType, setCropType] = useState("");
  const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");

  useEffect(() => {
    setLanguageLabel(languages[lang] || "English");
  }, [lang]);


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
      <h1 className="text-3xl font-bold mb-4">{languages[lang]?.selectCropType || "Select Crop Type"}</h1>

      <Select onValueChange={handleCropTypeSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={languages[lang]?.selectCropTypePlaceholder || "Select crop type"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fruit">{languages[lang]?.fruit || "Fruit"}</SelectItem>
          <SelectItem value="vegetable">{languages[lang]?.vegetable || "Vegetable"}</SelectItem>
        </SelectContent>
      </Select>

      <Button disabled={!cropType} onClick={handleNext} className="mt-4">
      {languages[lang]?.next || "Next"}
      </Button>
    </div>
  );
}
