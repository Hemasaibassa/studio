'use server';
/**
 * @fileOverview Recommends treatments (chemical and organic pesticides) for crop diseases.
 *
 * - recommendTreatment - A function that recommends treatments.
 * - RecommendTreatmentInput - The input type for the recommendTreatment function.
 * - RecommendTreatmentOutput - The return type for the recommendTreatment function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Weather} from '@/services/weather';

const RecommendTreatmentInputSchema = z.object({
  crop: z.string().describe('The type of crop (e.g., apple, tomato).'),
  soilType: z.string().describe('The type of soil used (e.g., sandy, clay).'),
  weather: z.custom<Weather>().describe('The weather conditions at the location.'),
  diagnosis: z.string().describe('The diagnosis of the crop disease.'),
});
export type RecommendTreatmentInput = z.infer<typeof RecommendTreatmentInputSchema>;

const RecommendTreatmentOutputSchema = z.object({
  chemicalPesticideRecommendations: z.array(z.string()).describe('Recommended chemical pesticides.'),
  organicPesticideRecommendations: z.array(z.string()).describe('Recommended organic pesticides.'),
});
export type RecommendTreatmentOutput = z.infer<typeof RecommendTreatmentOutputSchema>;

export async function recommendTreatment(input: RecommendTreatmentInput): Promise<RecommendTreatmentOutput> {
  return recommendTreatmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTreatmentPrompt',
  input: {
    schema: z.object({
      crop: z.string().describe('The type of crop.'),
      soilType: z.string().describe('The type of soil.'),
      weather: z.custom<Weather>().describe('The weather conditions.'),
      diagnosis: z.string().describe('The diagnosis of the crop disease.'),
    }),
  },
  output: {
    schema: z.object({
      chemicalPesticideRecommendations: z.array(z.string()).describe('Recommended chemical pesticides.'),
      organicPesticideRecommendations: z.array(z.string()).describe('Recommended organic pesticides.'),
    }),
  },
  prompt: `Based on the crop, soil type, weather conditions, and diagnosis, recommend chemical and organic pesticides.

Crop: {{{crop}}}
Soil Type: {{{soilType}}}
Weather: Conditions: {{{weather.conditions}}}, Temperature: {{{weather.temperatureCelsius}}}°C, Humidity: {{{weather.humidity}}}%, Wind Speed: {{{weather.windSpeedKph}}} km/h
Diagnosis: {{{diagnosis}}}

Chemical Pesticide Recommendations:
{{#each chemicalPesticideRecommendations}}
- {{{this}}}
{{/each}}

Organic Pesticide Recommendations:
{{#each organicPesticideRecommendations}}
- {{{this}}}
{{/each}}`,
});

const recommendTreatmentFlow = ai.defineFlow<
  typeof RecommendTreatmentInputSchema,
  typeof RecommendTreatmentOutputSchema
>(
  {
    name: 'recommendTreatmentFlow',
    inputSchema: RecommendTreatmentInputSchema,
    outputSchema: RecommendTreatmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
