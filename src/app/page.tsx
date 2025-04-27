"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to AgriAssist</h1>
      <p className="text-lg mb-8">Your AI assistant for smart farming.</p>
      <Button onClick={() => router.push("/language-select")}>Get Started</Button>
    </div>
  );
}
