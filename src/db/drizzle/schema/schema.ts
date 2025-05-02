import { boolean, index, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { randomID } from '@utils/random_id'

// Enums
export const measureTypeEnum = pgEnum('measure_type', [
	'WATER',
	'GAS'
])

// Tables

export const meterReadings = pgTable('meter_readings', {
	id: text().primaryKey().$defaultFn(() => randomID()),
	customer_code: text().notNull(),
	measure_uuid: text().notNull(),
	measure_value: integer().notNull(),
	measure_datetime: timestamp().notNull(),
	measure_type: measureTypeEnum().notNull(),
	has_confirmed: boolean().default(false).notNull(),
	image_url: text().notNull(),
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
}, ({ customer_code, measure_uuid }) => [
	index('meter_readings_customer_code_key').using('btree', customer_code),
	index('meter_readings_measure_uuid_key').using('btree', measure_uuid)
])