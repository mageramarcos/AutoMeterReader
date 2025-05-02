import { geminiClient } from '@clients/gemini'

import { FailedDependencyException } from '@utils/exceptions'
import { IFetchParams, IGeminiAdapter, IMeterReadingResponse } from '@adapters/IGeminiAdapter'

export class GeminiAdapter implements IGeminiAdapter {
	async fetch(data: IFetchParams): Promise<IMeterReadingResponse> {
		const response = await geminiClient().models.generateContent({
			model: 'gemini-2.0-flash',
			contents: [
				{
					inlineData: {
						mimeType: 'image/jpeg',
						data: data.image
					}
				},
				{ text: 'Read the value of the meter and return only the number without additional text.' }
			]
		})

		if (!response || !response.text) {
			throw new FailedDependencyException('Failed to process image with Gemini')
		}

		return { measure_value: response.text }
	}
}