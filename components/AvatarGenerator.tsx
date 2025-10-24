import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

interface AvatarGeneratorProps {
    username: string;
    onClose: () => void;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ username, onClose }) => {
    const [prompt, setPrompt] = useState(`A cool, futuristic avatar for a user named '${username}'`);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            const firstPart = response.candidates?.[0]?.content?.parts?.[0];
            if (firstPart && firstPart.inlineData) {
                const base64ImageBytes: string = firstPart.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                setGeneratedImage(imageUrl);
            } else {
                 setError('Could not generate image. Please try a different prompt.');
            }

        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
                Let's create a unique avatar for your profile. You can use our suggestion or write your own!
            </p>
            <div>
                <label htmlFor="avatar-prompt" className="block text-sm font-medium text-gray-700 mb-1">Your Prompt</label>
                <textarea
                    id="avatar-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}

            <div className="flex justify-center items-center h-48 bg-gray-100 rounded-md border-2 border-dashed">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-gray-600 mt-2">Generating...</span>
                    </div>
                ) : generatedImage ? (
                    <img src={generatedImage} alt="Generated Avatar" className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                    <p className="text-gray-500">Your avatar will appear here</p>
                )}
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Avatar'}
            </button>
            <div className="flex items-center justify-between mt-2">
                 <button onClick={onClose} className="w-full text-center text-sm font-medium text-gray-600 hover:text-black py-2">
                    Skip for now
                </button>
                 <button 
                    onClick={onClose} 
                    disabled={!generatedImage}
                    className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Finish
                </button>
            </div>
        </div>
    );
};

export default AvatarGenerator;
