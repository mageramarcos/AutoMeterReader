import { MeasureType } from './enum'

export type IMeterReading = {
	id: string
	customer_code: string
	measure_uuid: string
	measure_datetime: Date
	measure_value: number
	measure_type: MeasureType
	has_confirmed: boolean
	image_url: string
	created_at: Date
	updated_at: Date
}