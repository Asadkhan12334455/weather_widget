"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLocation("");
    setWeather(null);
    setError(null);
  };

  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }

  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return ` ${location} ${isNight ? "at Night" : "During the Day"}`;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f4f6" }}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          maxWidth: "24rem",
          margin: "auto",
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "0.75rem",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", // Box shadow for the Card
          padding: "1rem",
          border: isHovered ? "2px solid black" : "2px solid white",
          transition: "border-color 0.3s ease",
        }}
      >
        <CardHeader>
          <CardTitle style={{ fontSize: "1.875rem", fontWeight: "600", color: "#111827" }}>Weather Widget</CardTitle>
          <CardDescription style={{ color: "#6b7280", fontSize: "1rem", marginTop: "0.5rem" }}>Search for the current weather conditions in your city.</CardDescription>
        </CardHeader>
        <CardContent style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              style={{
                flex: "1",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)", // Box shadow for the Input
              }}
            />
            <Button type="submit" disabled={isLoading} style={{ padding: "0.75rem 1.25rem", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "0.375rem", fontWeight: "600", transition: "background-color 0.2s ease-in-out", cursor: isLoading ? "not-allowed" : "pointer" }}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
          <Button onClick={handleReset} style={{
            marginTop: "1rem",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: "600",
            padding: "0.75rem 1.25rem",
            transition: "background-color 0.5s ease-in-out",
            cursor: "pointer",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)", // Box shadow for the Reset Button
          }} >
            Reset
          </Button>
          {error && <div style={{ marginTop: "1rem", color: "#ef4444", fontWeight: "500" }}>{error}</div>}
          {weather && (
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.125rem" }}>
                <ThermometerIcon style={{ width: "1.5rem", height: "1.5rem", color: "#4b5563" }} />
                {getTemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.125rem" }}>
                <CloudIcon style={{ width: "1.5rem", height: "1.5rem", color: "#4b5563" }} />
                {getWeatherMessage(weather.description)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.125rem" }}>
                <MapPinIcon style={{ width: "1.5rem", height: "1.5rem", color: "#4b5563" }} />
                {getLocationMessage(weather.location)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
