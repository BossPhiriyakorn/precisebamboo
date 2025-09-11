// services/apiService.ts
// This file centralizes API call logic for the application.

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * =================================================================
 * Gemini API Service
 * =================================================================
 * Interacts with the Google Gemini API.
 * The API key MUST be provided via the `process.env.API_KEY` environment variable.
 */

// Initialize the Gemini client. The API key is handled by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates text content using a specified model.
 * @param prompt The text prompt to send to the model.
 * @returns The generated text response.
 */
export async function generateTextFromGemini(prompt: string): Promise<string> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const text = response.text;
        // The text property will be an empty string if there's no text content,
        // so checking for truthiness is sufficient.
        if (text) {
            return text;
        } else {
             // Handle cases where the response might be blocked or empty
             throw new Error('No text content received from Gemini API or response was empty.');
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // In a real application, you might want more sophisticated error handling,
        // like showing a user-friendly message.
        return "ขออภัย, เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง";
    }
}


/**
 * =================================================================
 * Generic API Service (Example)
 * =================================================================
 * Example of how to structure calls to other APIs.
 * In a real-world scenario, you would read keys from a .env file on the server-side
 * or have them injected during the build process. Frontend code cannot directly read .env files.
 * The environment variable `process.env.ANOTHER_SERVICE_API_KEY` would be an example.
 */

const ANOTHER_API_BASE_URL = 'https://api.anotherservice.com/v1';

/**
 * Fetches data from a generic API endpoint.
 * @param endpoint The API endpoint to call (e.g., '/data').
 * @returns The JSON response from the API.
 */
export async function fetchFromAnotherAPI(endpoint: string): Promise<any> {
    // In a real application, you would get this key from the environment.
    // NOTE: This is just a placeholder and will not work in this sandbox.
    const apiKey = process.env.ANOTHER_SERVICE_API_KEY; 

    try {
        const response = await fetch(`${ANOTHER_API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`, // Example authorization header
            },
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching from another API (${endpoint}):`, error);
        throw error; // Re-throw the error to be handled by the caller.
    }
}
