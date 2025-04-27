"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/constants";
import { useState, useEffect } from "react";

interface UserDetails {
  username: string;
  email: string;
  location: string;
}

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    // Simulate fetching user details
    const fetchUserDetails = async () => {
      // Replace this with your actual API call or data fetching logic
      const simulatedUserDetails: UserDetails = {
        username: "FarmerJohn",
        email: "john.farmer@example.com",
        location: "Rural Valley",
      };

      setUserDetails(simulatedUserDetails);
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-4 text-white">{languages[lang]?.profile || "Profile"}</h1>

      {userDetails ? (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div
            className="rounded-md p-4 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2 className="text-xl font-semibold mb-2">{languages[lang]?.userDetails || "User Details"}</h2>
            <p>
              {languages[lang]?.username || "Username"}: {userDetails.username}
            </p>
            <p>
              {languages[lang]?.email || "Email"}: {userDetails.email}
            </p>
            <p>
              {languages[lang]?.location || "Location"}: {userDetails.location}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-white">{languages[lang]?.loadingProfile || "Loading profile..."}</p>
      )}

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
