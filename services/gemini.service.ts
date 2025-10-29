/**
 * Gemini AI service for intelligent travel tips
 * Using Google's Gemini API for contextual travel advice
 * 
 * Get your free API key from: https://ai.google.dev/
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { WeatherAlert, WeatherData, WeatherForecast } from './weather.service';

// Gemini API key - Get from https://ai.google.dev/
const GEMINI_API_KEY = 'AIzaSyAHtFOuTX9qIqU_LWSEm8O2GR_G5uWVi4s'; // Replace with your key or use env var

// Initialize the Gemini AI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface TravelTips {
  clothing: string[];
  packing: string[];
  safety: string[];
}

/**
 * Generate intelligent travel tips using Gemini AI
 */
export async function getAITravelTips(
  weather: WeatherData,
  alerts: WeatherAlert[],
  forecast: WeatherForecast[]
): Promise<TravelTips> {
  try {
    // If no API key or client, use fallback logic
    if (!genAI) {
      console.log('No Gemini API key set, using fallback tips');
      return getFallbackTravelTips(weather, alerts);
    }

    // Build context for Gemini
    const prompt = buildTravelTipsPrompt(weather, alerts, forecast);

    console.log('Calling Gemini API for travel tips...');

    // Get the generative model (using gemini-1.5-flash for speed)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    console.log('✅ Received AI travel tips from Gemini');

    // Parse AI response into structured tips
    return parseAIResponse(aiResponse);
  } catch (error) {
    console.error('Error getting AI travel tips:', error);
    console.log('Falling back to rule-based tips...');
    // Fallback to rule-based tips if AI fails
    return getFallbackTravelTips(weather, alerts);
  }
}

/**
 * Build a prompt for Gemini AI
 */
function buildTravelTipsPrompt(
  weather: WeatherData,
  alerts: WeatherAlert[],
  forecast: WeatherForecast[]
): string {
  let prompt = `You are a helpful travel assistant providing personalized trip preparation advice. Based on the following weather conditions, provide specific, actionable travel tips.\n\n`;
  
  prompt += `Current Weather:\n`;
  prompt += `- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)\n`;
  prompt += `- Condition: ${weather.condition}\n`;
  prompt += `- Humidity: ${weather.humidity}%\n`;
  prompt += `- Wind Speed: ${weather.windSpeed} km/h\n`;
  prompt += `- Visibility: ${weather.visibility} km\n`;
  prompt += `- UV Index: ${weather.uvIndex}\n\n`;

  if (alerts.length > 0) {
    prompt += `Weather Alerts:\n`;
    alerts.forEach((alert) => {
      prompt += `- ${alert.event} (${alert.severity}): ${alert.description}\n`;
    });
    prompt += `\n`;
  }

  if (forecast.length > 0) {
    prompt += `3-Day Forecast:\n`;
    forecast.slice(0, 3).forEach((day, idx) => {
      const dateStr = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Day after';
      prompt += `- ${dateStr}: ${day.tempMin}°C to ${day.tempMax}°C, ${day.description}, ${day.chanceOfRain}% chance of rain\n`;
    });
    prompt += `\n`;
  }

  prompt += `Please provide travel tips in the following format:\n\n`;
  prompt += `CLOTHING:\n`;
  prompt += `- [Tip 1 with emoji]\n`;
  prompt += `- [Tip 2 with emoji]\n`;
  prompt += `- [Tip 3 with emoji]\n\n`;
  prompt += `PACKING:\n`;
  prompt += `- [Tip 1 with emoji]\n`;
  prompt += `- [Tip 2 with emoji]\n`;
  prompt += `- [Tip 3 with emoji]\n\n`;
  prompt += `SAFETY:\n`;
  prompt += `- [Tip 1 with emoji]\n`;
  prompt += `- [Tip 2 with emoji]\n`;
  prompt += `- [Tip 3 with emoji]\n\n`;
  prompt += `Make the tips specific to these weather conditions, practical, and include relevant emojis. Keep each tip concise (one line).`;

  return prompt;
}

/**
 * Parse Gemini AI response into structured tips
 */
function parseAIResponse(response: string): TravelTips {
  const clothing: string[] = [];
  const packing: string[] = [];
  const safety: string[] = [];

  const lines = response.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let currentSection: 'clothing' | 'packing' | 'safety' | null = null;

  for (const line of lines) {
    const upperLine = line.toUpperCase();
    
    if (upperLine.includes('CLOTHING')) {
      currentSection = 'clothing';
      continue;
    } else if (upperLine.includes('PACKING')) {
      currentSection = 'packing';
      continue;
    } else if (upperLine.includes('SAFETY')) {
      currentSection = 'safety';
      continue;
    }

    // Extract bullet points (handle -, *, •, or numbered lists)
    if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
      const tip = line.replace(/^[-*•]\s/, '').replace(/^\d+\.\s/, '').trim();
      
      if (currentSection === 'clothing' && clothing.length < 5) {
        clothing.push(tip);
      } else if (currentSection === 'packing' && packing.length < 5) {
        packing.push(tip);
      } else if (currentSection === 'safety' && safety.length < 5) {
        safety.push(tip);
      }
    }
  }

  // Ensure we have at least some tips in each category
  if (clothing.length === 0) {
    clothing.push('👕 Dress comfortably for the weather');
  }
  if (packing.length === 0) {
    packing.push('💧 Bring water and essentials');
  }
  if (safety.length === 0) {
    safety.push('✅ Check conditions before departure');
  }

  return { clothing, packing, safety };
}

/**
 * Fallback rule-based travel tips (when AI is unavailable)
 */
function getFallbackTravelTips(weather: WeatherData, alerts: WeatherAlert[]): TravelTips {
  const clothing: string[] = [];
  const packing: string[] = [];
  const safety: string[] = [];

  // Temperature-based clothing
  if (weather.temperature < 10) {
    clothing.push('🧥 Heavy jacket or coat');
    clothing.push('🧤 Gloves and warm hat');
    clothing.push('🧣 Scarf for extra warmth');
  } else if (weather.temperature < 20) {
    clothing.push('🧥 Light jacket or sweater');
    clothing.push('👕 Long-sleeve shirt');
  } else if (weather.temperature >= 30) {
    clothing.push('👕 Light, breathable clothing');
    clothing.push('🧢 Hat for sun protection');
    clothing.push('🕶️ Sunglasses');
  } else {
    clothing.push('👕 Comfortable casual wear');
    clothing.push('🧥 Light layer for evening');
  }

  // Precipitation-based packing
  if (weather.description.includes('rain') || weather.clouds > 70) {
    packing.push('☔ Umbrella or rain jacket');
    packing.push('👢 Waterproof shoes');
    safety.push('⚠️ Roads may be slippery - drive carefully');
  }

  // UV-based advice
  if (weather.uvIndex >= 6) {
    packing.push('🧴 Sunscreen (SPF 30+)');
    packing.push('🕶️ Sunglasses for UV protection');
    safety.push('☀️ High UV levels - limit sun exposure');
  }

  // Wind-based advice
  if (weather.windSpeed > 30) {
    safety.push('💨 Strong winds expected - secure loose items');
    packing.push('🧥 Windbreaker jacket');
  }

  // Visibility-based safety
  if (weather.visibility < 5) {
    safety.push('🌫️ Low visibility - use headlights and reduce speed');
  }

  // Alert-based safety
  alerts.forEach((alert) => {
    if (alert.severity === 'extreme' || alert.severity === 'severe') {
      safety.push(`⚠️ ${alert.event} - Consider rescheduling trip`);
    } else {
      safety.push(`⚠️ ${alert.event} - Plan accordingly`);
    }
  });

  // General packing
  packing.push('💧 Water bottle - stay hydrated');
  packing.push('📱 Phone charger and power bank');

  // If no safety warnings, add positive message
  if (safety.length === 0) {
    safety.push('✅ Good driving conditions expected');
    safety.push('🚗 Check route for any road work');
  }

  return { clothing, packing, safety };
}
