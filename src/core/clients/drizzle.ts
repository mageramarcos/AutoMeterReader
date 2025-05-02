import postgres from 'postgres'
import { AnyColumn, between, gte, lte, SQL } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from '@db/drizzle/schema'
import { env } from '@utils/env'

const client = postgres(env.DATABASE_URL)

export const drizzleClient = drizzle(client, { schema })

export const buildPeriodIntervalCondition = ({
	column, start, end
}: BuildPeriodIntervalConditionParams): SQL | undefined => {
	if (start !== undefined && end !== undefined) {
		return between(column, start, end)
	}
	if (start !== undefined) {
		return gte(column, start)
	}
	if (end !== undefined) {
		return lte(column, end)
	}
	return undefined
}

type BuildPeriodIntervalConditionParams = {
	column: AnyColumn
	start?: Date
	end?: Date
}