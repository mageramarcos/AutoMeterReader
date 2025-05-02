import cluster from 'node:cluster'
import process from 'node:process'
import { cpus } from 'node:os'

import http from '@http/app'

import { env } from '@utils/env'

if (cluster.isPrimary && env.NODE_ENV === 'production') {
	console.log(
		`[meter-vision] Primary cluster with pid ${process.pid} is running`
	)

	// Fork workers.
	for (let i = 0; i < cpus().length; i++) {
		cluster.fork()
	}

	cluster.on('exit', (worker) => {
		console.log(`[meter-vision] Worker with pid ${worker.process.pid} died`)
	})
} else {
	// Workers can share any TCP connection
	// In this case it is an fastify server
	console.log(`[meter-vision] Worker with pid ${process.pid} started`)
	http
		.listen({ port: env.PORT, host: '0.0.0.0' })
		.then(() => console.log(`[meter-vision] Server running on port ${env.PORT}`))
}