
import { NextResponse, NextRequest } from 'next/server';
import { analyzeCropHealth } from '@/ai/flows/analyze-crop-health';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';
    const crop = searchParams.get('crop');
    const soil = searchParams.get('soil');
    const leafImage = searchParams.get('leafImage');
    const temperature = searchParams.get('temperature');
    const conditions = searchParams.get('conditions');
    const humidity = searchParams.get('humidity');
    const windSpeed = searchParams.get('windSpeed');


    if (!crop || !soil || !leafImage || !temperature || !conditions || !humidity || !windSpeed) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

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
