"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { languages } from "@/lib/constants";

export default function SignUp() {
  const searchParams = useSearchParams();
  const router = useRouter();
    const lang = searchParams.get("lang") || "en";
    const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");

    useEffect(() => {
        setLanguageLabel(languages[lang] || "English");
    }, [lang]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // Implement signup logic here
    console.log("Signing up with:", { username, password });
    router.push(`/crop-select?lang=${lang}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>{languages[lang]?.signUp || "Sign Up"}</h1>
      <div className="flex flex-col gap-4">
        <Input
          style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}
          type="text"
          placeholder={languages[lang]?.username || "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
           style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}
          type="password"
          placeholder={languages[lang]?.password || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }} onClick={handleSignUp}>{languages[lang]?.signUp || "Sign Up"}</Button>
      </div>
    </div>
  );
}
