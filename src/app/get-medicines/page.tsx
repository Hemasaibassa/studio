"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function GetMedicines() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
    const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");

    useEffect(() => {
        setLanguageLabel(languages[lang] || "English");
    }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">{languages[lang]?.getMedicines || "Get Medicines"}</h1>
      <p className="text-lg mb-4">{languages[lang]?.medicinesAvailable || "This page will show available medicines for the recommended pesticides."}</p>

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)}>
        {languages[lang]?.home || "Home"}
        </Button>
        <Button variant="ghost">{languages[lang]?.newsletters || "Newsletters"}</Button>
        <Button variant="ghost">{languages[lang]?.yourCrops || "Your Crops"}</Button>
        <Button variant="ghost">{languages[lang]?.profile || "Profile"}</Button>
      </div>
    </div>
  );
}
