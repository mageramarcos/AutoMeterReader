import { MeasureType } from '@entities/enum'
import { IMeterReading } from '@entities/IMeterReadings'
import { CustomOmit } from '@utils/types'

export type ICreateParams = CustomOmit<IMeterReading, 'id' | 'created_at' | 'updated_at'>

export type IUpdateParams = {
	id: string
	data: Partial<CustomOmit<IMeterReading, 'id' | 'created_at' | 'updated_at'>>
}

export type IFindManyParams = {
	customer_code?: string
	start_date?: Date
	end_date?: Date
	measure_type?: MeasureType
}

// export type IFindFirstParams = Partial<{
// 	tracking_code: string
// }>

// export type ICountParams = CustomOmit<IFindManyParams, 'page'>

export interface IMeterReadingsRepository {
	create(params: ICreateParams): Promise<IMeterReading>
	findById(id: string): Promise<IMeterReading | null>
	// findFirst(params: IFindFirstParams): Promise<IMeterReading | null>
	findMany(params: IFindManyParams): Promise<IMeterReading[]>
	update(params: IUpdateParams): Promise<IMeterReading>
	// count(params: ICountParams): Promise<number>
	// delete(id: string): Promise<void>
}