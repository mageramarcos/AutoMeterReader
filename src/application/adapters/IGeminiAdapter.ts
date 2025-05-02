export type IFetchParams = {
	image: string
}

export type IMeterReadingResponse = {
	measure_value: string
}

export interface IGeminiAdapter {
	fetch(params: IFetchParams): Promise<IMeterReadingResponse>
}