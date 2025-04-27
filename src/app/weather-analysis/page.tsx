"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { languages, crops } from "@/lib/constants"; // Importing crops for localization
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Location, Weather, getWeather } from "@/services/weather";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera } from "lucide-react";

const formSchema = z.object({
  locationName: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

export default function WeatherAnalysis() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "en";
  const crop = searchParams.get("crop") || "";
  const [languageLabel, setLanguageLabel] = useState(languages[lang] || "English");
  const [leafImage, setLeafImage] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(true);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "",
    },
  });

  useEffect(() => {
    setLanguageLabel(languages[lang] || "English");
  }, [lang]);

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
            const fetchedLocationName = data.display_name || languages[lang]?.unknownLocation || "Unknown location";
            setLocationName(fetchedLocationName);
            form.setValue("locationName", fetchedLocationName); // Set the form value
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocationName(languages[lang]?.unknownLocation || "Unknown location");
            form.setValue("locationName", languages[lang]?.unknownLocation || "Unknown location"); // Set the form value
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: 'destructive',
            title: languages[lang]?.locationAccessDeniedTitle || 'Location Access Denied',
            description: languages[lang]?.locationAccessDeniedDescription || 'Please enable location permissions in your browser settings to use this app.',
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsGeolocationAvailable(false); // Set the state to indicate geolocation is not supported
      toast({
        variant: 'destructive',
        title: languages[lang]?.geolocationNotSupportedTitle || 'Geolocation Not Supported',
        description: languages[lang]?.geolocationNotSupportedDescription || 'Your browser does not support geolocation.',
      });
    }
  }, [lang, toast, form]);


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: languages[lang]?.cameraAccessDeniedTitle || 'Camera Access Denied',
          description: languages[lang]?.cameraAccessDeniedDescription || 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    if (showCamera) {
      getCameraPermission();
    }
  }, [lang, toast, showCamera]);

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

  const handleAnalyze = async () => {
    if (leafImage && weather) {
      setIsAnalyzing(true);
      try {
        const response = await fetch('/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lang,
            crop,
            leafImage,
            temperature: weather.temperatureCelsius,
            conditions: weather.conditions,
            humidity: weather.humidity,
            windSpeed: weather.windSpeedKph,
            locationName: locationName,
          }),
        });

        if (response.ok) {
          router.push(`/analysis?lang=${lang}`);
        } else {
          console.error('Analysis request failed', response.status);
          toast({
            variant: "destructive",
            title: languages[lang]?.analysisFailedTitle || "Analysis Failed",
            description: languages[lang]?.analysisFailedDescription || "There was an error analyzing your crop. Please try again.",
          });
        }
      } catch (error) {
        console.error('Error sending analysis request', error);
        toast({
          variant: "destructive",
          title: languages[lang]?.analysisFailedTitle || "Analysis Failed",
          description: languages[lang]?.analysisFailedDescription || "There was an error analyzing your crop. Please try again.",
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: languages[lang]?.missingDataTitle || "Missing Information",
        description: languages[lang]?.missingDataDescription || "Please upload a leaf image and ensure weather data is available.",
      });
    }
  };

  const getImageSource = () => {
    if (leafImage) {
      return leafImage;
    } else {
      // Use the crop image as a placeholder
      const cropData = crops[crop];
      return cropData?.image || "https://picsum.photos/100/100"; // default image
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 px-4 gap-4" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <h1 className="text-3xl font-bold mb-2"  style={{ color: 'white' }}>{languages[lang]?.weatherAnalysisTitle || "Weather Analysis & Image Upload"}</h1>

      <div className="w-full max-w-md flex flex-col gap-2" style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>
        <h2 className="text-xl font-semibold mb-1">{languages[lang]?.currentLocationTitle || "Current Location"}</h2>
        <p>{locationName || languages[lang]?.fetchingLocation || "Fetching location..."}</p>

        <h2 className="text-xl font-semibold mb-1">{languages[lang]?.currentWeatherTitle || "Current Weather"}</h2>
        {weather ? (
          <>
            <p>{languages[lang]?.temperature || "Temperature"}: {weather.temperatureCelsius}°C</p>
            <p>{languages[lang]?.conditions || "Conditions"}: {weather.conditions}</p>
            <p>{languages[lang]?.humidity || "Humidity"}: {weather.humidity}%</p>
            <p>{languages[lang]?.windSpeed || "Wind Speed"}: {weather.windSpeedKph} km/h</p>
          </>
        ) : (
          <p>{languages[lang]?.fetchingWeather || "Fetching weather..."}</p>
        )}
      </div>

      <div className="w-full max-w-md flex flex-col gap-4" >
        {/* Display geolocation error message */}
        {!isGeolocationAvailable && (
          <Alert variant="destructive">
            <AlertTitle>{languages[lang]?.geolocationNotSupportedTitle || "Geolocation Not Supported"}</AlertTitle>
            <AlertDescription>
              {languages[lang]?.geolocationNotSupportedDescription || "Your browser does not support geolocation or it is disabled. Please enable it to use this feature."}
            </AlertDescription>
          </Alert>
        )}
        <div className="border rounded-md p-4 shadow-sm" style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }}>
          <h2 className="text-xl font-semibold mb-2">{languages[lang]?.leafImageTitle || "Leaf Image"}</h2>
          <img src={getImageSource()} alt={languages[lang]?.leafImageAlt || "Leaf Image"} className="w-32 h-32 object-cover rounded mb-2" style={{ borderRadius: '1rem' }} />
          <Input type="file" accept="image/*" onChange={handleLeafImageUpload} disabled={showCamera} />
          <Button onClick={() => setShowCamera(true)} disabled={showCamera} style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}>
          <Camera className="mr-2" />
          {languages[lang]?.takePicture || "Take Picture"}
          </Button>

          {showCamera && (
            <div>
              <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

              {!hasCameraPermission && (
                <Alert variant="destructive">
                  <AlertTitle>{languages[lang]?.cameraAccessRequiredTitle || "Camera Access Required"}</AlertTitle>
                  <AlertDescription>
                    {languages[lang]?.cameraAccessRequiredDescription || "Please allow camera access to use this feature."}
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={handleCaptureImage} disabled={!hasCameraPermission}  style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}>
                {languages[lang]?.captureImage || "Capture Image"}
              </Button>
              <Button onClick={() => setShowCamera(false)} style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}>{languages[lang]?.cancel || "Cancel"}</Button>
            </div>
          )}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <div className="grid gap-2">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold mb-2">{languages[lang]?.locationNameTitle || "Location Name"}</h2>
              <Input id="locationName" placeholder={languages[lang]?.locationNamePlaceholder || "Enter location name"} type="text" value={form.watch("locationName")} disabled style={{ backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.75rem' }} />
            </div>
          </div>
          <Button type="submit" disabled={!leafImage || !weather || isAnalyzing} onClick={handleAnalyze}  style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '1rem', padding: '0.75rem' }}>
            {isAnalyzing
              ? languages[lang]?.analyzing || "Analyzing..."
              : languages[lang]?.analyze || "Analyze"}
          </Button>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-around">
        <Button variant="ghost" onClick={() => router.push(`/?lang=${lang}`)}>
          {languages[lang]?.home || "Home"}
        </Button>
        <Button variant="ghost">{languages[lang]?.newsletters || "Newsletters"}</Button>
        <Button variant="ghost">{languages[lang]?.yourCrops || "Your Crops"}</Button>
        <Button variant="ghost">{languages[lang]?.profile || "Profile"}</Button>
      </div>
    </div>
  );
}
