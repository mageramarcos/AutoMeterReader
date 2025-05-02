import { FastifyInstance } from 'fastify'

import { applyUseCase } from '@http/middlewares/apply_use_case'

import { listMeterReadings, meterReadingValidation, processMeterReading } from '@use-cases/meter-reading'

export const mensureRoutes = async(fastify: FastifyInstance) => {
	fastify.post(
		'/readings',
		applyUseCase(processMeterReading)
	)
	fastify.patch(
		'/confirm',
		applyUseCase(meterReadingValidation, { separate_body: true })
	)
	fastify.get(
		'/:customer_code/list',
		applyUseCase(listMeterReadings)
	)
}