"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { analyzeCropHealth } from "@/ai/flows/analyze-crop-health";

export default function Analysis() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const crop = searchParams.get("crop") || "";
  const soil = searchParams.get("soil") || "";
  const leafImage = searchParams.get("leafImage") || "";
  const soilImage = searchParams.get("soilImage") || "";
  const temperature = searchParams.get("temperature") || "";
  const conditions = searchParams.get("conditions") || "";
  const humidity = searchParams.get("humidity") || "";
  const windSpeed = searchParams.get("windSpeed") || "";
  const languageLabel = languages[lang] || "English";

  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const analyze = async () => {
      try {
        const cropType = crop === "papaya" ? "fruit" : "vegetable"; // Example logic
        const analysis = await analyzeCropHealth({
          cropType: cropType,
          cropName: crop,
          soilType: soil,
          photoDataUri: decodeURIComponent(leafImage),
          soilAnalysisDataUri: decodeURIComponent(soilImage),
          weatherData: {
            temperatureCelsius: Number(temperature),
            conditions: conditions,
            humidity: Number(humidity),
            windSpeedKph: Number(windSpeed),
          },
        });
        setAnalysisResult(analysis);
      } catch (error: any) {
        console.error("Analysis failed", error);
        setAnalysisResult({ diagnosis: "Analysis failed. Please try again.", confidence: 0, recommendations: { chemicalPesticides: [], organicPesticides: [] } });
      }
    };

    analyze();
  }, [crop, soil, leafImage, soilImage, temperature, conditions, humidity, windSpeed]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Crop Analysis</h1>
      <p className="text-lg mb-4">Language: {languageLabel}</p>

      {analysisResult ? (
        <div className="flex flex-col gap-4">
          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Diagnosis</h2>
            <p>{analysisResult.diagnosis}</p>
            <p>Confidence: {analysisResult.confidence}</p>
          </div>

          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
            <div>
              <h3 className="text-lg font-semibold">Chemical Pesticides</h3>
              {analysisResult.recommendations.chemicalPesticides.length > 0 ? (
                <ul>
                  {analysisResult.recommendations.chemicalPesticides.map((pesticide: string, index: number) => (
                    <li key={index}>{pesticide}</li>
                  ))}
                </ul>
              ) : (
                <p>No chemical pesticides recommended.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Organic Pesticides</h3>
              {analysisResult.recommendations.organicPesticides.length > 0 ? (
                <ul>
                  {analysisResult.recommendations.organicPesticides.map((pesticide: string, index: number) => (
                    <li key={index}>{pesticide}</li>
                  ))}
                </ul>
              ) : (
                <p>No organic pesticides recommended.</p>
              )}
            </div>
          </div>

          <Button onClick={() => router.push("/get-medicines")}>Get Medicines</Button>
        </div>
      ) : (
        <p>Analyzing...</p>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push("/")}>Home</Button>
        <Button variant="ghost">Newsletters</Button>
        <Button variant="ghost">Your Crops</Button>
        <Button variant="ghost">Profile</Button>
      </div>
    </div>
  );
}
