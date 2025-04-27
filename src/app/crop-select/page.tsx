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
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>{languages[lang]?.selectCropType || "Select Crop Type"}</h1>

      <Select onValueChange={handleCropTypeSelect}>
        <SelectTrigger className="w-[180px]" style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>
          <SelectValue placeholder={languages[lang]?.selectCropTypePlaceholder || "Select crop type"} />
        </SelectTrigger>
        <SelectContent style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>
          <SelectItem value="fruit"  style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>{languages[lang]?.fruit || "Fruit"}</SelectItem>
          <SelectItem value="vegetable"  style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>{languages[lang]?.vegetable || "Vegetable"}</SelectItem>
        </SelectContent>
      </Select>

      <Button disabled={!cropType} onClick={handleNext} className="mt-4"  style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}>
      {languages[lang]?.next || "Next"}
      </Button>
    </div>
  );
}
