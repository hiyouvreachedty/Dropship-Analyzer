
import React from 'react';
import type { SourcingOption, PricingSuggestion } from '../types';

interface ResultsDisplayProps {
  imageUrl: string;
  productDescription: string;
  sourcingOptions: SourcingOption[];
  pricingSuggestion: PricingSuggestion | null;
}

const PlatformLogo: React.FC<{ platform: string }> = ({ platform }) => {
    const styles = "font-bold text-lg"
    switch(platform) {
        case 'AliExpress': return <span className={`${styles} text-red-500`}>AliExpress</span>
        case 'eBay': return <span className={`${styles} text-blue-500`}>eBay</span>
        case 'Depop': return <span className={`${styles} text-yellow-400`}>Depop</span>
        default: return <span className={styles}>{platform}</span>
    }
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ imageUrl, productDescription, sourcingOptions, pricingSuggestion }) => {
    const cheapestOption = sourcingOptions[0];

  return (
    <div className="w-full text-left space-y-8 animate-fade-in">
      {/* Product Identification */}
      <section className="bg-base-200 rounded-xl p-6 shadow-2xl border border-base-300">
        <h2 className="text-2xl font-bold mb-4 text-brand-secondary">Your Item</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <img src={imageUrl} alt="Uploaded item" className="w-full md:w-1/3 h-auto object-contain rounded-lg bg-base-100" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-secondary mb-2">AI Generated Description</h3>
            <p className="text-xl font-medium bg-base-100 p-4 rounded-md">"{productDescription}"</p>
          </div>
        </div>
      </section>

      {/* Sourcing Options */}
      <section className="bg-base-200 rounded-xl p-6 shadow-2xl border border-base-300">
        <h2 className="text-2xl font-bold mb-4 text-brand-secondary">Sourcing Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sourcingOptions.map((option, index) => (
            <div key={index} className={`bg-base-100 rounded-lg overflow-hidden shadow-lg border-2 transition-all ${index === 0 ? 'border-green-500 scale-105' : 'border-base-300'}`}>
              {index === 0 && <div className="bg-green-500 text-white text-center text-sm font-bold py-1">Cheapest Find</div>}
              <img src={option.imageUrl} alt={option.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <PlatformLogo platform={option.platform} />
                    <p className="text-2xl font-bold text-green-400">${option.price.toFixed(2)}</p>
                </div>
                <p className="text-text-secondary text-sm truncate">{option.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profit Projection */}
      {pricingSuggestion && cheapestOption && (
        <section className="bg-base-200 rounded-xl p-6 shadow-2xl border border-base-300">
          <h2 className="text-2xl font-bold mb-4 text-brand-secondary">Profit Projection</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-baseline p-3 bg-base-100 rounded-md">
                <span className="text-text-secondary">Recommended Price:</span>
                <span className="text-3xl font-bold text-brand-primary">${pricingSuggestion.recommendedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline p-3 bg-base-100 rounded-md">
                <span className="text-text-secondary">Source Cost:</span>
                <span className="text-xl font-semibold text-red-500">-${cheapestOption.price.toFixed(2)}</span>
              </div>
               <div className="flex justify-between items-baseline p-3 bg-base-100 rounded-md border-t-2 border-green-500">
                <span className="text-text-secondary font-bold">Potential Profit:</span>
                <span className="text-3xl font-bold text-green-400">${pricingSuggestion.profitPerItem.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex-1 bg-base-100 p-4 rounded-md">
                <h4 className="font-semibold text-lg mb-2">AI Reasoning:</h4>
                <p className="text-text-secondary italic">"{pricingSuggestion.reasoning}"</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
