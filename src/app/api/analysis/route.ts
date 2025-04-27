import { NextResponse, NextRequest } from 'next/server';
import { analyzeCropHealth } from '@/ai/flows/analyze-crop-health';

export async function POST(request: NextRequest) {
  try {
    const { lang, crop, leafImage, temperature, conditions, humidity, windSpeed, locationName } = await request.json();

    const cropType = crop === 'papaya' ? 'fruit' : 'vegetable'; // Example logic
    const analysis = await analyzeCropHealth({
      cropType: cropType,
      cropName: crop,
      photoDataUri: leafImage,
      weatherData: {
        temperatureCelsius: Number(temperature),
        conditions: conditions,
        humidity: Number(humidity),
        windSpeedKph: Number(windSpeed),
      },
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Analysis failed', error);
    return NextResponse.json({ diagnosis: 'Analysis failed. Please try again.', confidence: 0, recommendations: { chemicalPesticides: [], organicPesticides: [] } }, { status: 500 });
  }
}

