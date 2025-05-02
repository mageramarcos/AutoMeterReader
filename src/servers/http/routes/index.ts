import { FastifyInstance } from 'fastify'

import { mensureRoutes } from './mensure_routes'

export const routes = async(fastify: FastifyInstance) => {
	fastify.register(mensureRoutes)
}
