import type { Config } from 'drizzle-kit'
import { env } from './src/core/utils/env'

export default {
	schema: './src/db/drizzle/schema/schema.ts',
	out: './migrations',
	dialect: 'postgresql',
	migrations: {
		prefix: 'timestamp'
	},
	dbCredentials: {
		url: env.DATABASE_URL
	}
} satisfies Config