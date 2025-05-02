import { GoogleGenAI } from '@google/genai'
import { env } from '@utils/env'

export const geminiClient = () => {
	const apiKey = env.GEMINI_API_KEY

	if (!apiKey) {
		throw new Error('API key is required for Gemini client')
	}

	return new GoogleGenAI({ apiKey })
}