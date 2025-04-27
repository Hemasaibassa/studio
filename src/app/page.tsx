"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en'; // Default to 'en' if no language is selected

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-4xl font-bold mb-4 text-white">{languages[lang]?.welcome || "Welcome to AgriAssist"}</h1>
      <img src="https://images.unsplash.com/photo-1519682337058-a94d513c94bb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sustainable Family Garden" className="mb-4 rounded-xl shadow-2xl" style={{ width: '400px', height: '250px', objectFit: 'cover' }} />
      <p className="text-white text-lg mb-4">{languages[lang]?.growSeedlings || "Grow seedlings to green up your city"}</p>
      <Button
        style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem' }}
        onClick={() => router.push(`/language-select`)}
      >
        {languages[lang]?.getStarted || "Get Started"}
      </Button>
    </div>
  );
}
