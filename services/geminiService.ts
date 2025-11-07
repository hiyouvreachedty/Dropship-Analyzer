
import { GoogleGenAI, Type } from "@google/genai";
import type { SourcingOption, PricingSuggestion, TrendingPrompt } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const fileToGenerativePart = (base64Data: string, mimeType: string | undefined) => {
    if (!mimeType) {
        throw new Error("MIME type is not defined for the image.");
    }
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
};

export const identifyProduct = async (base64Data: string, mimeType: string | undefined): Promise<string> => {
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    const textPart = {
        text: `You are an expert e-commerce product analyst.
        Describe this clothing item in a concise but detailed manner, focusing on keywords a user would search for to find it online.
        Example: "brown halter neck ruched mini bubble dress with pearl details".
        Do not add any preamble or extra text. Just provide the description.`
    };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] }
    });
    
    return response.text.trim();
};

export const findSourcingOptions = async (productDescription: string): Promise<SourcingOption[]> => {
    const response = await ai.models.generateContent({
        model,
        contents: `Based on the product description "${productDescription}", generate a JSON array of 6 realistic-looking product listings from AliExpress, eBay, and Depop.
        - Create 2 listings for each platform.
        - Each item must have these exact keys: "platform" (string: 'AliExpress', 'eBay', or 'Depop'), "title" (string), "price" (number), and "imageUrl" (string).
        - For "imageUrl", use a placeholder from source.unsplash.com with keywords from the product title (e.g., https://source.unsplash.com/400x600/?denim,skirt).
        - Make the prices realistic for dropshipping, with AliExpress being the cheapest, then eBay, and Depop being the most expensive.
        - Ensure the output is ONLY a valid JSON array and nothing else.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        platform: { type: Type.STRING, enum: ['AliExpress', 'eBay', 'Depop'] },
                        title: { type: Type.STRING },
                        price: { type: Type.NUMBER },
                        imageUrl: { type: Type.STRING },
                    },
                    required: ["platform", "title", "price", "imageUrl"],
                },
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SourcingOption[];
    } catch (e) {
        console.error("Failed to parse sourcing options JSON:", response.text);
        throw new Error("Could not parse sourcing options from API response.");
    }
};

export const getPricingSuggestion = async (productDescription: string, cheapestPrice: number): Promise<PricingSuggestion> => {
    const response = await ai.models.generateContent({
        model,
        contents: `I am dropshipping this item: "${productDescription}".
        The cheapest I can source it for is $${cheapestPrice.toFixed(2)}.
        - Recommend a competitive selling price for a platform like Depop or a personal store.
        - Provide a brief reasoning for the price.
        - Return a valid JSON object with these exact keys: "recommendedPrice" (number), "profitPerItem" (number), and "reasoning" (string).
        - Calculate the profit based on your recommended price minus the source price.
        - Ensure the output is ONLY a valid JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recommendedPrice: { type: Type.NUMBER },
                    profitPerItem: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                },
                required: ["recommendedPrice", "profitPerItem", "reasoning"],
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PricingSuggestion;
    } catch (e) {
        console.error("Failed to parse pricing suggestion JSON:", response.text);
        throw new Error("Could not parse pricing suggestion from API response.");
    }
};

export const getTrendingPrompts = async (): Promise<TrendingPrompt[]> => {
    const response = await ai.models.generateContent({
        model,
        contents: `Act as a fashion trend analyst. Provide a JSON array of 8 currently trending clothing items or aesthetics.
        - For each item, provide a "prompt" which is a short, searchable description (e.g., "Y2K cyber grunge top").
        - For each item, also provide a single "icon" keyword from this list: 'dress', 'top', 'pants', 'jacket', 'shoes', 'accessory', 'skirt', 'misc'.
        - Ensure the output is ONLY a valid JSON array and nothing else.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        prompt: { type: Type.STRING, description: "A short, catchy description of a trending clothing item." },
                        icon: { type: Type.STRING, description: "A single keyword for an icon, e.g., 'dress', 'jacket', 'pants'." },
                    },
                    required: ["prompt", "icon"],
                },
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as TrendingPrompt[];
    } catch (e) {
        console.error("Failed to parse trending prompts JSON:", response.text);
        // Return a default list on failure to avoid breaking the UI
        return [
            { prompt: "Vintage oversized leather jacket", icon: "jacket" },
            { prompt: "Baggy cargo pants", icon: "pants" },
            { prompt: "Crochet knit halter top", icon: "top" },
            { prompt: "Platform combat boots", icon: "shoes" },
            { prompt: "Fairycore midi skirt", icon: "skirt" },
            { prompt: "Silver charm necklace", icon: "accessory" },
        ];
    }
};
