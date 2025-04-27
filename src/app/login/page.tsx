"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { languages } from "@/lib/constants";

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
    const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");

    useEffect(() => {
        setLanguageLabel(languages[lang] || "English");
    }, [lang]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Logging in with:", { username, password });
    router.push(`/crop-select?lang=${lang}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">{languages[lang]?.login || "Login"}</h1>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder={languages[lang]?.username || "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder={languages[lang]?.password || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>{languages[lang]?.login || "Login"}</Button>
        <Button variant="secondary" onClick={() => router.push(`/signup?lang=${lang}`)}>
        {languages[lang]?.signUp || "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
