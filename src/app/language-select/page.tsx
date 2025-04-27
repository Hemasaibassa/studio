"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";

export default function LanguageSelect() {
  const router = useRouter();

  const handleLanguageSelect = (lang: string) => {
    router.push(`/login?lang=${lang}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>Select Your Language</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(languages).map(([key, language]) => (
          <Button style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem' }} key={key} onClick={() => handleLanguageSelect(key)}>
            {language.language}
          </Button>
        ))}
      </div>
    </div>
  );
}
