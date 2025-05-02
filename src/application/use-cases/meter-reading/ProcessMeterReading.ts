import joi from 'joi'
import fs from 'fs/promises'
import path from 'path'

import validator from '@utils/validator'
import { IUseCase, IWrappedUseCase } from '@utils/use_cases'
import { BadRequestException, ConflictException } from '@utils/exceptions'

import { IGeminiAdapter } from '@adapters/IGeminiAdapter'
import { generateUUID } from '@utils/random_id'
import { MeasureType, MeasureTypeEnum } from '@entities/enum/MeasureTypeEnum'
import { IMeterReadingsRepository } from '@repositories/IMeterReadingsRepository'

type ProcessMeterReadingRequest = {
	image: string // Base64 encoded image
	customer_code: string
	measure_datetime: string // ISO 8601 formatted datetime
	measure_type: MeasureType // "WATER" | "GAS"
}

type ProcessMeterReadingResponse = {
	image_url: string
	measure_value: number
	measure_uuid: string
}

type T = ProcessMeterReadingRequest
type K = ProcessMeterReadingResponse

export type IProcessMeterReading = IWrappedUseCase<T, K>

export class ProcessMeterReading implements IUseCase<T, K> {
	constructor(
		private readonly geminiAdapter: IGeminiAdapter,
		private readonly meterReadingsRepository: IMeterReadingsRepository
	) {}

	async execute({ image, customer_code, measure_datetime, measure_type }: T): Promise<K> {
		const startOfMonth = new Date(measure_datetime)
		startOfMonth.setDate(1)
		startOfMonth.setHours(0, 0, 0, 0)

		const endOfMonth = new Date(startOfMonth)
		endOfMonth.setMonth(endOfMonth.getMonth() + 1)

		const duplicateReading = await this.meterReadingsRepository.findMany({
			measure_type,
			start_date: startOfMonth,
			end_date: endOfMonth
		})

		if (duplicateReading.length > 0) {
			throw new ConflictException({
				error_code: 'DOUBLE_REPORT',
				error_description: 'Leitura do mês já realizada'
			})
		}

		const ImageReading = await this.geminiAdapter.fetch({ image })

		const result = {
			image_url: await this.createTempImageUrl(image),
			measure_value: Number(ImageReading.measure_value),
			measure_uuid: generateUUID()
		}

		await this.meterReadingsRepository.create({
			...result,
			customer_code,
			measure_datetime: new Date(measure_datetime),
			measure_type,
			has_confirmed: false
		})

		return result
	}

	private async createTempImageUrl(base64Data: string): Promise<string> {
		const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64')
		const tempDir = path.join(process.cwd(), 'temp')

		await fs.mkdir(tempDir, { recursive: true })

		const tempFilePath = path.join(tempDir, `temp_${Date.now()}.jpg`)
		await fs.writeFile(tempFilePath, buffer)

		// Corrige a exibição do caminho (substitui \\ por \)
		return tempFilePath.replace(/\\/g, '/')
	}

	async validate(data: T): Promise<T> {
		const schema = joi.object<T>({
			image: joi.string().base64().required(),
			customer_code: joi.string().required(),
			measure_datetime: joi.string().isoDate().required(),
			measure_type: joi.string().valid(...Object.values(MeasureTypeEnum)).required()
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