# API Keys Setup Guide

This document explains how to get and configure the API keys needed for the Pothole Map app's weather and AI features.

## 🌤️ WeatherAPI.com (Weather Data)

**Why**: Provides current weather, forecasts, and weather alerts for trip planning.

**Free Tier**: 1 million API calls per month (very generous!)

### Steps to Get Your API Key:

1. Visit [https://www.weatherapi.com/signup.aspx](https://www.weatherapi.com/signup.aspx)
2. Sign up with your email (free account)
3. Verify your email address
4. Go to your [API Key page](https://www.weatherapi.com/my/)
5. Copy your API key

### Configure in App:

Open `services/weather.service.ts` and replace:
```typescript
const WEATHER_API_KEY = 'YOUR_WEATHERAPI_KEY';
```
with:
```typescript
const WEATHER_API_KEY = 'your_actual_api_key_here';
```

---

## 🤖 Google Gemini AI (Smart Travel Tips)

**Why**: Generates personalized, context-aware travel tips based on weather conditions using AI.

**Free Tier**: 60 requests per minute (plenty for most use cases!)

### Steps to Get Your API Key:

1. Visit [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API key in Google AI Studio"
3. Sign in with your Google account
4. Click "Create API Key"
5. Choose a Google Cloud project (or create a new one)
6. Copy your API key

### Configure in App:

Open `services/gemini.service.ts` and replace:
```typescript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```
with:
```typescript
const GEMINI_API_KEY = 'your_actual_api_key_here';
```

---

## 🔧 Environment Variables (Optional - Recommended)

For better security, you can use environment variables instead of hardcoding API keys:

### 1. Create a `.env` file in the root directory:

```env
WEATHER_API_KEY=your_weatherapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install `expo-constants`:

```bash
npx expo install expo-constants
```

### 3. Create `app.config.js`:

```javascript
export default {
  expo: {
    // ...other config
    extra: {
      weatherApiKey: process.env.WEATHER_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
    },
  },
};
```

### 4. Update service files to use env vars:

**In `services/weather.service.ts`:**
```typescript
import Constants from 'expo-constants';

const WEATHER_API_KEY = Constants.expoConfig?.extra?.weatherApiKey || 'YOUR_WEATHERAPI_KEY';
```

**In `services/gemini.service.ts`:**
```typescript
import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || 'YOUR_GEMINI_API_KEY';
```

### 5. Add `.env` to `.gitignore`:

```
.env
```

---

## 🧪 Testing Without API Keys

The app will work even without API keys! Both services have built-in fallback mechanisms:

- **Weather Service**: Returns mock weather data (22°C, partly cloudy, sample alerts)
- **Gemini Service**: Uses rule-based travel tips (still helpful, just not AI-powered)

This means you can:
- Test the app immediately without any setup
- Develop and demo features with realistic data
- Add real API keys when you're ready to go live

---

## 📊 API Usage Limits

| Service | Free Tier | Rate Limit | Notes |
|---------|-----------|------------|-------|
| WeatherAPI.com | 1M calls/month | No strict limit | More than enough for personal/dev use |
| Google Gemini | Free | 60 requests/min | Very generous for travel tips |

---

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for production
3. **Regenerate keys** if accidentally exposed
4. **Monitor usage** on respective dashboards
5. **Set up alerts** for unusual activity

---

## 🚀 Quick Start (with API keys)

1. Get both API keys (5 minutes total)
2. Update the two service files
3. Run `npx expo start`
4. Test the Trip Planner tab
5. See AI-powered weather insights! ✨

---

## ❓ Troubleshooting

### Weather data not loading?
- Check your WeatherAPI.com API key is correct
- Verify your internet connection
- Check API key quota on [weatherapi.com/my/](https://www.weatherapi.com/my/)

### Travel tips seem generic?
- Verify Gemini API key is set correctly
- Check console for any API errors
- The app will fallback to rule-based tips if AI fails

### "API key invalid" error?
- Make sure you copied the entire key (no spaces)
- Check if the key is activated (may take a few minutes)
- Regenerate the key if it's not working

---

## 🎯 Next Steps

Once you have your API keys configured:
1. Test the Trip Planner with real location
2. Try different weather conditions
3. See how Gemini generates contextual tips
4. Customize the prompts in `gemini.service.ts` for your needs!

Happy travels! 🚗💨
