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
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-4xl font-bold mb-4" style={{ color: 'white' }}>{languages[lang]?.welcome || "Welcome to AgriAssist"}</h1>
      <img src="https://via.placeholder.com/300x200" alt="Sustainable Family Garden" className="mb-4 rounded-xl shadow-2xl" />
      <p style={{ color: 'white' }}>{languages[lang]?.growSeedlings || "Grow seedlings to green up your city"}</p>
      <Button style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem' }} onClick={() => router.push(`/language-select`)}>{languages[lang]?.getStarted || "Get Started"}</Button>
    </div>
  );
}
