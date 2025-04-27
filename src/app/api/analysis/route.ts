import { NextResponse, NextRequest } from 'next/server';
import { analyzeCropHealth } from '@/ai/flows/analyze-crop-health';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'en';
    // console.log('lang', lang)
    const { crop, soil, leafImage, temperature, conditions, humidity, windSpeed, locationName } = request as any;

    const cropType = crop === 'papaya' ? 'fruit' : 'vegetable'; // Example logic
    const analysis = await analyzeCropHealth({
      cropType: cropType,
      cropName: crop,
      soilType: soil,
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
