import { UseCaseHandler } from '@utils/use_cases'
import { ProcessMeterReading } from './ProcessMeterReading'
import { GeminiAdapter } from '@adapters/implementations/GeminiAdapter'
import { DrizzleMeterReadingsRepository } from '@repositories/implementations'
import { MeterReadingValidation } from './MeterReadingValidation'
import { ListMeterReadings } from './ListMeterReadings'

export const processMeterReading = () => new UseCaseHandler(
	new ProcessMeterReading(
		new GeminiAdapter(),
		new DrizzleMeterReadingsRepository()
	)
)

export const meterReadingValidation = () => new UseCaseHandler(
	new MeterReadingValidation(
		new DrizzleMeterReadingsRepository()
	)
)

export const listMeterReadings = () => new UseCaseHandler(
	new ListMeterReadings(
		new DrizzleMeterReadingsRepository()
	)
)