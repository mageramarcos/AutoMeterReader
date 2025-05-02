import joi from 'joi'

import validator from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use_cases'
import { BadRequestException, ConflictException, NotFoundException } from '@utils/exceptions'

import { IMeterReadingsRepository } from '@repositories/IMeterReadingsRepository'

type MeterReadingValidationRequest = {
	data:{
		measure_uuid: string
		confirmed_value: number
	}
}

type MeterReadingValidationResponse = {
	success: boolean
}

type T = MeterReadingValidationRequest
type K = MeterReadingValidationResponse

export type IMeterReadingValidation = IWrappedUseCase<T, K>

export class MeterReadingValidation implements IUseCase<T, K> {
	constructor(
		private readonly meterReadingsRepository: IMeterReadingsRepository
	) {}

	async execute({ data }: T): Promise<K> {
		const existingReading = await this.meterReadingsRepository.findById(data.measure_uuid)

		if (existingReading === null) {
			throw new NotFoundException({
				error_code: 'MEASURE_NOT_FOUND',
				error_description: 'Leitura do mês já realizada'
			})
		}

		const startOfMonth = new Date(existingReading.measure_datetime)
		startOfMonth.setDate(1)
		startOfMonth.setHours(0, 0, 0, 0)

		const endOfMonth = new Date(startOfMonth)
		endOfMonth.setMonth(endOfMonth.getMonth() + 1)

		const duplicateReading = await this.meterReadingsRepository.findMany({
			customer_code: existingReading.customer_code,
			start_date: startOfMonth,
			end_date: endOfMonth
		})

		const hasDuplicateOfSameType = duplicateReading.some(
			(reading) => reading.measure_type === existingReading.measure_type &&
				reading.has_confirmed === true
		)

		if (hasDuplicateOfSameType) {
			throw new ConflictException({
				error_code: 'DUPLICATE_MEASURE_TYPE',
				error_description: 'Já existe uma medida duplicada para o mesmo tipo no período'
			})
		}

		const allCustomerReadings = await this.meterReadingsRepository.findMany({
			customer_code: existingReading.customer_code
		})

		const hasDuplicateConfirmedValue = allCustomerReadings.some(
			(reading) => reading.measure_value === data.confirmed_value &&
				reading.has_confirmed === true &&
				data.confirmed_value <= reading.measure_value
		)

		if (hasDuplicateConfirmedValue) {
			throw new ConflictException({
				error_code: 'DUPLICATE_CONFIRMED_VALUE',
				error_description: 'Já existe uma medida com este valor confirmado para o cliente'
			})
		}

		const has_confirmed = true

		await this.meterReadingsRepository.update({
			id: existingReading.id,
			data: {
				measure_value: data.confirmed_value,
				has_confirmed
			}
		})

		return {
			success: has_confirmed
		}
	}

	async validate(data: T): Promise<T> {
		const schema = joi.object({
			data: joi.object({
				measure_uuid: joi.string().uuid().required(),
				confirmed_value: joi.number().positive().required()
			}).required()
		})
		const validated = await validator<T>(schema, data)
		if (!validated.isValid) {
			throw new BadRequestException({
				error_code: 'INVALID_DATA',
				error_description: validated.error
			})
		}
		return validated.data
	}
}