
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || '/api/ollama/generate';
const OLLAMA_TAGS_URL = import.meta.env.VITE_OLLAMA_TAGS_URL || '/api/ollama/tags';
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.1';

export const checkConnection = async () => {
    try {
        const response = await fetch(OLLAMA_TAGS_URL);
        if (!response.ok) throw new Error('Failed to connect to Ollama');
        const data = await response.json();
        return { ok: true, models: data.models || [] };
    } catch (error) {
        console.error("Ollama Connection Check Failed:", error);
        return { ok: false, error: error.message };
    }
};

export const generateQuizQuestions = async (topic) => {
    const prompt = `
    You are a quiz generator. Generate a JSON array of 5 multiple choice questions about "${topic}".
    
    The schema for each question must be:
        {
            "question": "string",
                "options": ["string", "string", "string", "string"],
                    "correct": number(0 - 3 index of correct answer),
                        "explanation": "string (Short explanation of why the correct answer is right)"
        }

    Return ONLY the raw JSON array.Do not wrap in markdown code blocks.Do not add any introductory text.
        Example:
    [
        {
            "question": "What is 2+2?",
            "options": ["3", "4", "5", "6"],
            "correct": 1,
            "explanation": "2 plus 2 equals 4."
        }
    ]
    `;

    try {
        console.log(`Generating quiz for topic: ${topic} `);
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
                format: "json" // Enforce JSON mode if supported by model/version
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText} `);
        }

        const data = await response.json();
        const responseText = data.response;

        console.log('Raw Ollama response:', responseText);

        let parsedData;

        try {
            // Attempt to parse JSON directly
            parsedData = JSON.parse(responseText);
        } catch (e) {
            // Fallback: try to find JSON array or object in the text
            const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    parsedData = JSON.parse(jsonMatch[0]);
                } catch (pe) {
                    throw new Error('Failed to extract valid JSON');
                }
            } else {
                throw new Error('Failed to parse quiz JSON');
            }
        }

        // If it's an array, return it
        if (Array.isArray(parsedData)) {
            return parsedData;
        }

        // If it's an object, look for an array property (e.g. "questions", "data", "quiz")
        if (typeof parsedData === 'object' && parsedData !== null) {
            // Check common keys first
            if (Array.isArray(parsedData.questions)) return parsedData.questions;
            if (Array.isArray(parsedData.quiz)) return parsedData.quiz;
            if (Array.isArray(parsedData.data)) return parsedData.data;

            // Search any key for an array
            const arrayValue = Object.values(parsedData).find(val => Array.isArray(val));
            if (arrayValue) {
                return arrayValue;
            }
        }

        throw new Error('Response did not contain a quiz array');

    } catch (error) {
        console.error('Quiz Generation Error:', error);
        throw error;
    }
};

export const generateFlashcards = async (topic) => {
    const prompt = `
    You are a study aid generator.Generate a JSON array of 8 flashcards about "${topic}".
    
    The schema for each card must be:
        {
            "front": "string (Concept or Question)",
                "back": "string (Definition or Answer)"
        }

    Return ONLY the raw JSON array.Do not wrap in markdown.
        Example:
    [
        { "front": "Mitochondria", "back": "Powerhouse of the cell" }
    ]
    `;

    try {
        console.log(`Generating flashcards for: ${topic} `);
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
                format: "json"
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ollama API Error:", response.status, errorText);
            throw new Error(`Ollama API error: ${response.status} ${response.statusText} `);
        }

        const data = await response.json();
        console.log("Raw Ollama Flashcard Response:", data.response);

        let parsedData;
        try {
            // 1. Try direct parsing
            parsedData = JSON.parse(data.response);
        } catch (e) {
            console.warn("Direct JSON parse failed, trying regex fallback...");
            // 2. Try to extract from markdown ```json ... ``` or just [...]
            // Improved regex to handle newlines and potential markdown wrappers
            const match = data.response.match(/\[[\s\S]*\]/);
            if (match) {
                try {
                    parsedData = JSON.parse(match[0]);
                } catch (pe) {
                    console.error("Regex extract parse failed:", pe);
                    throw new Error("Failed to extract valid JSON array");
                }
            } else {
                throw new Error("No JSON array found in response");
            }
        }

        if (Array.isArray(parsedData)) return parsedData;

        // Handle case where it's wrapped in an object like { "flashcards": [...] }
        if (parsedData && typeof parsedData === 'object') {
            if (Array.isArray(parsedData.flashcards)) return parsedData.flashcards;
            if (Array.isArray(parsedData.cards)) return parsedData.cards;
            if (Array.isArray(parsedData.data)) return parsedData.data;

            // Last ditch: find any array value
            const anyArray = Object.values(parsedData).find(v => Array.isArray(v));
            if (anyArray) return anyArray;
        }

        console.error("Parsed data structure invalid:", parsedData);
        throw new Error("Invalid response format: Not an array");

    } catch (error) {
        console.error('Flashcard Generation Error:', error);
        throw error;
    }
};
