"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";
import { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  content: string;
}

export default function Newsletters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    // Simulate fetching news articles based on the selected language
    const fetchNews = async () => {
      // Replace this with your actual API call or data fetching logic
      const simulatedNews: NewsArticle[] = [
        {
          title: languages[lang]?.newsArticle1Title || "Latest Farming Tips",
          content: languages[lang]?.newsArticle1Content || "Check out the latest tips for improving your crop yield.",
        },
        {
          title: languages[lang]?.newsArticle2Title || "Upcoming Agricultural Events",
          content: languages[lang]?.newsArticle2Content || "Stay informed about the upcoming agricultural events in your region.",
        },
      ];

      setNews(simulatedNews);
    };

    fetchNews();
  }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4 text-white">{languages[lang]?.newsletters || "Newsletters"}</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {news.map((article, index) => (
          <div
            key={index}
            className="rounded-md p-4 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p>{article.content}</p>
          </div>
        ))}
      </div>

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
