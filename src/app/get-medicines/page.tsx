"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GetMedicines() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Get Medicines</h1>
      <p className="text-lg mb-4">This page will show available medicines for the recommended pesticides.</p>

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)}>Home</Button>
        <Button variant="ghost">Newsletters</Button>
        <Button variant="ghost">Your Crops</Button>
        <Button variant="ghost">Profile</Button>
      </div>
    </div>
  );
}
