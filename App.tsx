import React, { useState, useEffect } from 'react';
import type { LogoConfig } from './types';
import { LogoStyle } from './types';
import { generateLogosApi } from './services/geminiService';
import { Header } from './components/Header';
import { LogoConfigForm } from './components/LogoConfigForm';
import { LogoDisplay } from './components/LogoDisplay';


function App() {
  const [config, setConfig] = useState<LogoConfig>({
    style: LogoStyle.MODERN,
    color: 'Electric Blue and Carbon Fiber Black',
    text: 'Kaar',
    details: 'Sleek and dynamic feel',
  });
  const [apiKey, setApiKey] = useState<string>('');
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load API key from local storage on initial render
  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Save API key to local storage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini-api-key', apiKey);
    }
  }, [apiKey]);


  const handleGenerateLogos = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API Key to generate logos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedLogos([]);

    const prompt = `
      Create a professional, high-resolution, vector-style logo for an automotive brand named "${config.text}".
      The logo must be on a clean, solid, light-colored background (like #f0f0f0), not a photo.
      
      Key characteristics:
      - Style: ${config.style}
      - Primary Color Scheme: ${config.color}
      - Core Concept: An emblem or logomark suitable for a car badge.
      - Do not include extra descriptive text like 'logo' or 'vector' in the image itself. The only text should be the brand name, if requested.
      - Additional details: ${config.details}.
      - The output should be a clean, commercial-ready brand mark.
    `;

    try {
      const logos = await generateLogosApi(prompt, apiKey);
      setGeneratedLogos(logos);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LogoConfigForm
              config={config}
              setConfig={setConfig}
              apiKey={apiKey}
              setApiKey={setApiKey}
              onSubmit={handleGenerateLogos}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <LogoDisplay
              logos={generatedLogos}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Gemini. Designed for Kaar.</p>
      </footer>
    </div>
  );
}

export default App;
