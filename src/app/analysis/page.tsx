"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  recommendations: {
    chemicalPesticides: string[];
    organicPesticides: string[];
  };
}

export function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analysis?lang=${lang}`,{
            method: 'GET', // Specify the method
            headers: {
              'Content-Type': 'application/json', // Set the Content-Type header
            }
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Crop Analysis</h1>

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
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)}>Home</Button>
        <Button variant="ghost">Newsletters</Button>
        <Button variant="ghost">Your Crops</Button>
        <Button variant="ghost">Profile</Button>
      </div>
    </div>
  );
}
