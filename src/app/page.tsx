"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en'; // Default to 'en' if no language is selected
    const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");

    useEffect(() => {
        setLanguageLabel(languages[lang] || "English");
    }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">{languages[lang]?.welcome || "Welcome to AgriAssist"}</h1>
      <Button onClick={() => router.push(`/language-select`)}>{languages[lang]?.getStarted || "Get Started"}</Button>
    </div>
  );
}
