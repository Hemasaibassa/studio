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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Select Your Language</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(languages).map(([key, label]) => (
          <Button key={key} onClick={() => handleLanguageSelect(key)}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
