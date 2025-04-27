"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { languages } from "@/lib/constants";

interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  recommendations: {
    chemicalPesticides: string[];
    organicPesticides: string[];
  };
}

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");

    useEffect(() => {
        setLanguageLabel(languages[lang] || "English");
    }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/analysis`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

        if (response.ok) {
          const data: AnalysisResult = await response.json();
          setAnalysisResult(data);
        } else {
          console.error('Failed to fetch analysis data', response.status);
          setAnalysisResult({ diagnosis: "Analysis failed. Please try again.", confidence: 0, recommendations: { chemicalPesticides: [], organicPesticides: [] } });
        }
      } catch (error) {
        console.error('Error fetching analysis data', error);
        setAnalysisResult({ diagnosis: "Analysis failed. Please try again.", confidence: 0, recommendations: { chemicalPesticides: [], organicPesticides: [] } });
      }
    };

    fetchData();
  }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>{languages[lang]?.analysisResult || "Crop Analysis"}</h1>

      {analysisResult ? (
        <div className="flex flex-col gap-4">
          <div className="border rounded p-4" style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>
            <h2 className="text-xl font-semibold mb-2">{languages[lang]?.diagnosis || "Diagnosis"}</h2>
            <p>{analysisResult.diagnosis}</p>
            <p>{languages[lang]?.confidence || "Confidence"}: {analysisResult.confidence}</p>
          </div>

          <div className="border rounded p-4" style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>
            <h2 className="text-xl font-semibold mb-2">{languages[lang]?.recommendations || "Recommendations"}</h2>
            <div>
              <h3 className="text-lg font-semibold">{languages[lang]?.chemicalPesticides || "Chemical Pesticides"}</h3>
              {analysisResult.recommendations.chemicalPesticides.length > 0 ? (
                <ul>
                  {analysisResult.recommendations.chemicalPesticides.map((pesticide: string, index: number) => (
                    <li key={index}>{pesticide}</li>
                  ))}
                </ul>
              ) : (
                <p>{languages[lang]?.noChemicalPesticides || "No chemical pesticides recommended."}</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{languages[lang]?.organicPesticides || "Organic Pesticides"}</h3>
              {analysisResult.recommendations.organicPesticides.length > 0 ? (
                <ul>
                  {analysisResult.recommendations.organicPesticides.map((pesticide: string, index: number) => (
                    <li key={index}>{pesticide}</li>
                  ))}
                </ul>
              ) : (
                <p>{languages[lang]?.noOrganicPesticides || "No organic pesticides recommended."}</p>
              )}
            </div>
          </div>

          <Button onClick={() => router.push("/get-medicines")} style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}>{languages[lang]?.getMedicines || "Get Medicines"}</Button>
        </div>
      ) : (
        <p>{languages[lang]?.analyzing || "Analyzing..."}</p>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)}>{languages[lang]?.home || "Home"}</Button>
        <Button variant="ghost">{languages[lang]?.newsletters || "Newsletters"}</Button>
        <Button variant="ghost">{languages[lang]?.yourCrops || "Your Crops"}</Button>
        <Button variant="ghost">{languages[lang]?.profile || "Profile"}</Button>
      </div>
    </div>
  );
}
