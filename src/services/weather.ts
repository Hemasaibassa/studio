/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents weather information, including temperature and conditions.
 */
export interface Weather {
  /**
   * The temperature in Celsius.
   */
  temperatureCelsius: number;
  /**
   * The weather conditions (e.g., Sunny, Cloudy, Rainy).
   */
  conditions: string;
  /**
   * The humidity percentage.
   */
  humidity: number;
  /**
   * The wind speed in kilometers per hour.
   */
  windSpeedKph: number;
}

/**
 * Asynchronously retrieves weather information for a given location.
 * @param location The location for which to retrieve weather data.
 * @returns A promise that resolves to a Weather object containing weather information.
 */
export async function getWeather(location: Location): Promise<Weather> {
  // TODO: Implement this by calling an API.

  return {
    temperatureCelsius: 25,
    conditions: 'Sunny',
    humidity: 60,
    windSpeedKph: 15,
  };
}
