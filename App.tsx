
import React, { useState, useCallback, useEffect } from 'react';
import { identifyProduct, findSourcingOptions, getPricingSuggestion, getTrendingPrompts } from './services/geminiService';
import type { SourcingOption, PricingSuggestion, AppState, TrendingPrompt } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingIndicator } from './components/LoadingIndicator';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TrendingPrompts } from './components/TrendingPrompts';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [sourcingOptions, setSourcingOptions] = useState<SourcingOption[]>([]);
  const [pricingSuggestion, setPricingSuggestion] = useState<PricingSuggestion | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [trendingPrompts, setTrendingPrompts] = useState<TrendingPrompt[]>([]);

  useEffect(() => {
    // Fetch trending prompts when the component mounts
    const fetchPrompts = async () => {
      try {
        const prompts = await getTrendingPrompts();
        setTrendingPrompts(prompts);
      } catch (err) {
        console.error("Failed to fetch trending prompts:", err);
        // Fallback prompts are handled in the service, so UI won't be empty
      }
    };
    fetchPrompts();
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setImageFile(file);
      setError(null);
      setSourcingOptions([]);
      setPricingSuggestion(null);
      setProductDescription('');
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(async () => {
    if (!imageUrl) {
      setError('Please upload an image first.');
      return;
    }
    
    const base64Data = imageUrl.split(',')[1];
    if (!base64Data) {
        setError('Could not read image data.');
        return;
    }

    try {
      setAppState('identifying');
      setError(null);
      const description = await identifyProduct(base64Data, imageFile?.type);
      setProductDescription(description);

      setAppState('sourcing');
      const options = await findSourcingOptions(description);
      const sortedOptions = [...options].sort((a, b) => a.price - b.price);
      setSourcingOptions(sortedOptions);

      const cheapestOption = sortedOptions[0];
      if (cheapestOption) {
        setAppState('pricing');
        const suggestion = await getPricingSuggestion(description, cheapestOption.price);
        setPricingSuggestion(suggestion);
      } else {
         throw new Error("Could not find any sourcing options to generate pricing.");
      }
      
      setAppState('results');
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
      setAppState('error');
    }
  }, [imageUrl, imageFile]);
  
  const handlePromptClick = useCallback(async (prompt: string) => {
    try {
      setAppState('sourcing');
      setError(null);
      setProductDescription(prompt);
      setImageUrl(''); // Reset image, it will be set from sourcing results
      setImageFile(null);
      setSourcingOptions([]);
      setPricingSuggestion(null);

      const options = await findSourcingOptions(prompt);
      const sortedOptions = [...options].sort((a, b) => a.price - b.price);
      setSourcingOptions(sortedOptions);

      const cheapestOption = sortedOptions[0];
      if (cheapestOption) {
        setImageUrl(cheapestOption.imageUrl); // Use cheapest option's image for display
        setAppState('pricing');
        const suggestion = await getPricingSuggestion(prompt, cheapestOption.price);
        setPricingSuggestion(suggestion);
      } else {
        throw new Error("Could not find any sourcing options to generate pricing.");
      }
      
      setAppState('results');
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
      setAppState('error');
    }
  }, []);

  const handleReset = () => {
    setImageFile(null);
    setImageUrl('');
    setProductDescription('');
    setSourcingOptions([]);
    setPricingSuggestion(null);
    setAppState('idle');
    setError(null);
  };

  const isProcessing = appState === 'identifying' || appState === 'sourcing' || appState === 'pricing';

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-text-primary">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl text-center">
          {appState === 'idle' && (
            <>
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                imageUrl={imageUrl} 
                processImage={processImage} 
                isProcessing={isProcessing} 
              />
              <TrendingPrompts 
                prompts={trendingPrompts}
                onPromptClick={handlePromptClick}
                isProcessing={isProcessing}
              />
            </>
          )}
          
          {isProcessing && <LoadingIndicator state={appState} />}
          
          {(appState === 'results' || appState === 'error') && (
            <>
              {error ? (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative my-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              ) : (
                <ResultsDisplay
                  imageUrl={imageUrl}
                  productDescription={productDescription}
                  sourcingOptions={sourcingOptions}
                  pricingSuggestion={pricingSuggestion}
                />
              )}
              <button
                onClick={handleReset}
                className="mt-8 bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg"
              >
                Analyze Another Item
              </button>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
