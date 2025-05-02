import joi from 'joi'

import validator from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use_cases'
import { BadRequestException, NotFoundException } from '@utils/exceptions'

import { IMeterReadingsRepository } from '@repositories/IMeterReadingsRepository'
import { MeasureType, MeasureTypeEnum } from '@entities/enum'

type ListMeterReadingsRequest = {
	customer_code: string
	measure_type?: MeasureType
}

type ListMeterReadingsResponse = {
	customer_code: string
	measures: {
		measure_uuid: string
		measure_datetime: Date
		measure_type: string
		has_confirmed: boolean
		image_url: string
	}[]
}

type T = ListMeterReadingsRequest
type K = ListMeterReadingsResponse

export type IListMeterReadings = IWrappedUseCase<T, K>

export class ListMeterReadings implements IUseCase<T, K> {
	constructor(
		private readonly meterReadingsRepository: IMeterReadingsRepository
	) {}

	async execute({ customer_code, measure_type }: T): Promise<K> {
		const readings = await this.meterReadingsRepository.findMany({
			customer_code,
			measure_type: measure_type?.toUpperCase() as MeasureType
		})

		if (readings.length === 0) {
			throw new NotFoundException({
				error_code: 'MEASURES_NOT_FOUND',
				error_description: 'Nenhuma leitura encontrada'
			})
		}

		return {
			customer_code,
			measures: readings.map((reading) => ({
				measure_uuid: reading.measure_uuid,
				measure_datetime: reading.measure_datetime,
				measure_type: reading.measure_type,
				has_confirmed: reading.has_confirmed,
				image_url: reading.image_url
			}))
		}
	}

	async validate(data: T): Promise<T> {
		const schema = joi.object({
			customer_code: joi.string().required(),
			measure_type: joi.string().valid(...Object.values(MeasureTypeEnum).map((type) => type
				.toLowerCase())).optional().insensitive()
		})
		const validated = await validator<T>(schema, data)
		if (!validated.isValid) {
			throw new BadRequestException({
				error_code: 'INVALID_TYPE',
				// error_description: 'Tipo de medição não permitida'
				error_description: validated.error
			})
		}
		return validated.data
	}
}