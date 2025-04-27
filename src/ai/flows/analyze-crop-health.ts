'use server';
/**
 * @fileOverview Analyzes crop health based on image input, crop selection, and weather data.
 *
 * - analyzeCropHealth - A function that analyzes crop health and returns a diagnosis.
 * - AnalyzeCropHealthInput - The input type for the analyzeCropHealth function.
 * - AnalyzeCropHealthOutput - The return type for the analyzeCropHealth function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Weather} from '@/services/weather';

const AnalyzeCropHealthInputSchema = z.object({
  cropType: z.enum(['fruit', 'vegetable']).describe('The type of crop (fruit or vegetable).'),
  cropName: z.string().describe('The name of the crop.'),
  photoDataUri: z
    .string()
    .describe(
      'A photo of the infected part of the leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  weatherData: z.object({
    temperatureCelsius: z.number().describe('The temperature in Celsius.'),
    conditions: z.string().describe('The weather conditions (e.g., Sunny, Cloudy, Rainy).'),
    humidity: z.number().describe('The humidity percentage.'),
    windSpeedKph: z.number().describe('The wind speed in kilometers per hour.'),
  }).describe('The weather data for the current location.'),
});

export type AnalyzeCropHealthInput = z.infer<typeof AnalyzeCropHealthInputSchema>;

const AnalyzeCropHealthOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the potential disease or infection.'),
  confidence: z.number().describe('The confidence score for the diagnosis (0-1).'),
  recommendations: z.object({
    chemicalPesticides: z.array(z.string()).describe('Recommended chemical pesticides.'),
    organicPesticides: z.array(z.string()).describe('Recommended organic pesticides.'),
  }).describe('Pesticide recommendations based on the diagnosis and weather conditions.'),
});

export type AnalyzeCropHealthOutput = z.infer<typeof AnalyzeCropHealthOutputSchema>;

export async function analyzeCropHealth(input: AnalyzeCropHealthInput): Promise<AnalyzeCropHealthOutput> {
  return analyzeCropHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropHealthPrompt',
  input: {
    schema: z.object({
      cropType: z.enum(['fruit', 'vegetable']).describe('The type of crop (fruit or vegetable).'),
      cropName: z.string().describe('The name of the crop.'),
      photoDataUri: z
        .string()
        .describe(
          'A photo of the infected part of the leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
        ),
      weatherData: z.object({
        temperatureCelsius: z.number().describe('The temperature in Celsius.'),
        conditions: z.string().describe('The weather conditions (e.g., Sunny, Cloudy, Rainy).'),
        humidity: z.number().describe('The humidity percentage.'),
        windSpeedKph: z.number().describe('The wind speed in kilometers per hour.'),
      }).describe('The weather data for the current location.'),
    }),
  },
  output: {
    schema: z.object({
      diagnosis: z.string().describe('The diagnosis of the potential disease or infection.'),
      confidence: z.number().describe('The confidence score for the diagnosis (0-1).'),
      recommendations: z.object({
        chemicalPesticides: z.array(z.string()).describe('Recommended chemical pesticides.'),
        organicPesticides: z.array(z.string()).describe('Recommended organic pesticides.'),
      }).describe('Pesticide recommendations based on the diagnosis and weather conditions.'),
    }),
  },
  prompt: `You are an expert in plant pathology. Analyze the provided information to diagnose potential diseases or infections affecting the crop.

  Crop Type: {{{cropType}}}
  Crop Name: {{{cropName}}}
  Leaf Photo: {{media url=photoDataUri}}
  Weather Data: Temperature: {{{weatherData.temperatureCelsius}}}°C, Conditions: {{{weatherData.conditions}}}, Humidity: {{{weatherData.humidity}}}%, Wind Speed: {{{weatherData.windSpeedKph}}} km/h

  Based on this information, provide a diagnosis, a confidence score (0-1), and recommendations for chemical and organic pesticides.
  Format your response as a JSON object.
  `, 
});

const analyzeCropHealthFlow = ai.defineFlow<
  typeof AnalyzeCropHealthInputSchema,
  typeof AnalyzeCropHealthOutputSchema
>(
  {
    name: 'analyzeCropHealthFlow',
    inputSchema: AnalyzeCropHealthInputSchema,
    outputSchema: AnalyzeCropHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
