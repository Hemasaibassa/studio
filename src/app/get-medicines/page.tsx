"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";

export default function GetMedicines() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4 text-white">{languages[lang]?.getMedicines || "Get Medicines"}</h1>
      <p className="text-lg mb-4 text-white">{languages[lang]?.medicinesAvailable || "This page will show available medicines for the recommended pesticides."}</p>

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
