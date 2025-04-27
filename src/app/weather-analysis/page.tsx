"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Location, Weather, getWeather } from "@/services/weather";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WeatherAnalysis() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const crop = searchParams.get("crop") || "";
  const soil = searchParams.get("soil") || "";
  const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");
  const [leafImage, setLeafImage] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);


  useEffect(() => {
    setLanguageLabel(languages[lang] || "English");
  }, [lang]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        // toast({
        //   variant: 'destructive',
        //   title: 'Camera Access Denied',
        //   description: 'Please enable camera permissions in your browser settings to use this app.',
        // });
      }
    };

    getCameraPermission();
  }, []);



  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);

          // Reverse geocode to get the location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLocation.lat}&lon=${newLocation.lng}`
            );
            const data = await response.json();
            setLocationName(data.display_name || "Unknown location");
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocationName("Unknown location");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // toast({
          //   variant: 'destructive',
          //   title: 'Location Access Denied',
          //   description: 'Please enable location permissions in your browser settings to use this app.',
          // });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      getWeather(location).then(setWeather);
    }
  }, [location]);

  const handleLeafImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeafImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      setLeafImage(dataURL);
      setShowCamera(false);
    }
  };

  const handleAnalyze = () => {
    if (leafImage && weather) {
      router.push(
        `/analysis?lang=${lang}&crop=${crop}&soil=${soil}&leafImage=${encodeURIComponent(
          leafImage
        )}&temperature=${weather.temperatureCelsius}&conditions=${weather.conditions}&humidity=${weather.humidity}&windSpeed=${weather.windSpeedKph}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Weather Analysis &amp; Image Upload</h1>

      {locationName && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Location</h2>
          <p>{locationName}</p>
        </div>
      )}

      {weather && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
          <p>Temperature: {weather.temperatureCelsius}°C</p>
          <p>Conditions: {weather.conditions}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeedKph} km/h</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Leaf Image</h2>
          <Input type="file" accept="image/*" onChange={handleLeafImageUpload} />
          {leafImage && <img src={leafImage} alt="Leaf" className="w-32 h-32 object-cover rounded mt-2" />}
        </div>

        <div>
          <Button onClick={() => setShowCamera(true)}>Take Picture</Button>
        </div>

        {showCamera && (
                <div>
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

                    { !(hasCameraPermission) && (
                        <Alert variant="destructive">
                                  <AlertTitle>Camera Access Required</AlertTitle>
                                  <AlertDescription>
                                    Please allow camera access to use this feature.
                                  </AlertDescription>
                          </Alert>
                    )
                    }


                  <Button onClick={handleCaptureImage} disabled={!hasCameraPermission}>Capture Image</Button>
                </div>
              )}

        <Button disabled={!leafImage || !weather} onClick={handleAnalyze}>
          Analyze
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)}>Home</Button>
        <Button variant="ghost">Newsletters</Button>
        <Button variant="ghost">Your Crops</Button>
        <Button variant="ghost">Profile</Button>
      </div>
    </div>
  );
}
