"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { languages } from "@/lib/constants";

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Logging in with:", { username, password });
    router.push(`/crop-select?lang=${lang}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4 text-white">{languages[lang]?.login || "Login"}</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Input
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          type="text"
          placeholder={languages[lang]?.username || "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          type="password"
          placeholder={languages[lang]?.password || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}
          onClick={handleLogin}
        >
          {languages[lang]?.login || "Login"}
        </Button>
        <Button
          style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}
          variant="secondary"
          onClick={() => router.push(`/signup?lang=${lang}`)}
        >
          {languages[lang]?.signUp || "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
