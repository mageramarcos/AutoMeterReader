import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth'

import { isHttpException } from '@utils/exceptions'

import { routes } from '@http/routes'

const app = fastify({ ignoreTrailingSlash: true })

// plugins
app.register(cors, {
	origin: (origin, cb) => {
		cb(null, origin || true)
	},
	credentials: true
})
app.register(fastifyAuth)

// internal
app.register(routes)

// error handler
app.setErrorHandler((error, req, reply) => {
	if (isHttpException(error)) {
		return reply
			.status(error.status_code)
			.send({ process: error.process, body: error.body })
	}

	console.error(
		`Unhandled error on ${req.method} ${req.originalUrl}`,
		JSON.stringify(error.message, null, 2)
	)

	return reply.status(500).send({
		process: 'failed',
		body: 'Internal server error'
	})
})

export default app