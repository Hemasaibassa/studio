"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";
import { useState, useEffect } from "react";

interface AnalyzedCrop {
  name: string;
  date: string;
}

export default function YourCrops() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [analyzedCrops, setAnalyzedCrops] = useState<AnalyzedCrop[]>([]);

  useEffect(() => {
    // Simulate fetching previously analyzed crops
    const fetchAnalyzedCrops = async () => {
      // Replace this with your actual API call or data fetching logic
      const simulatedAnalyzedCrops: AnalyzedCrop[] = [
        {
          name: languages[lang]?.papaya || "Papaya",
          date: "2024-01-20",
        },
        {
          name: languages[lang]?.tomato || "Tomato",
          date: "2024-01-15",
        },
      ];

      setAnalyzedCrops(simulatedAnalyzedCrops);
    };

    fetchAnalyzedCrops();
  }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4 text-white">{languages[lang]?.yourCrops || "Your Crops"}</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {analyzedCrops.map((crop, index) => (
          <div
            key={index}
            className="rounded-md p-4 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2 className="text-xl font-semibold mb-2">{crop.name}</h2>
            <p>
              {languages[lang]?.analysisDate || "Analysis Date"}: {crop.date}
            </p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-around" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)} style={{ color: 'white' }}>
          {languages[lang]?.home || "Home"}
        </Button>
        <Button variant="ghost" onClick={() => router.push(`/newsletters?lang=${lang}`)} style={{ color: 'white' }}>
          {languages[lang]?.newsletters || "Newsletters"}
        </Button>
        <Button variant="ghost" onClick={() => router.push(`/your-crops?lang=${lang}`)} style={{ color: 'white' }}>
          {languages[lang]?.yourCrops || "Your Crops"}
        </Button>
        <Button variant="ghost" onClick={() => router.push(`/profile?lang=${lang}`)} style={{ color: 'white' }}>
          {languages[lang]?.profile || "Profile"}
        </Button>
      </div>
    </div>
  );
}
