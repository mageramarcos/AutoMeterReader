import { buildPeriodIntervalCondition, drizzleClient } from '@clients/drizzle'

import { meterReadings } from '@db/drizzle/schema'

import { IMeterReading } from '@entities/IMeterReadings'
import { ICreateParams, IFindManyParams, IMeterReadingsRepository, IUpdateParams } from '@repositories/IMeterReadingsRepository'
import { and, asc, eq, SQL } from 'drizzle-orm'

type MountWhereParams = IFindManyParams

export class DrizzleMeterReadingsRepository implements IMeterReadingsRepository {
	async create(data: ICreateParams): Promise<IMeterReading> {
		return await drizzleClient
			.insert(meterReadings)
			.values(data)
			.returning()
			.then(([result]) => result)
	}

	async findById(id: string): Promise<IMeterReading | null> {
		return await drizzleClient.query.meterReadings.findFirst({
			where: eq(meterReadings.measure_uuid, id)
		}) || null
	}

	// async findFirst({
	// 	tracking_code
	// }: IFindFirstParams): Promise<IMeterReading | null> {
	// 	const where: SQL[] = []
	// 	if (tracking_code !== undefined) {
	// 		where.push(eq(meterReadings.tracking_code, tracking_code))
	// 	}

	// 	return await drizzleClient.query.meterReadings.findFirst({
	// 		where: and(...where)
	// 	}) || null
	// }

	async findMany({
		...filter
	}: IFindManyParams): Promise<IMeterReading[]> {
		const dynamicQuery = drizzleClient
			.select()
			.from(meterReadings)
			.orderBy(asc(meterReadings.created_at))
			.where(and(...this.mountWhere(filter)))
			.$dynamic()

		return await dynamicQuery
	}

	async update({ id, data }: IUpdateParams): Promise<IMeterReading> {
		return await drizzleClient
			.update(meterReadings)
			.set(data)
			.where(eq(meterReadings.id, id))
			.returning()
			.then(([result]) => result)
	}

	// async count(filter: ICountParams): Promise<number> {
	// 	return await drizzleClient
	// 		.select({ count: count() })
	// 		.from(meterReadings)
	// 		.where(and(...this.mountWhere(filter)))
	// 		.then(([result]) => result.count)
	// }

	// async delete(id: string): Promise<void> {
	// 	await drizzleClient
	// 		.delete(meterReadings)
	// 		.where(eq(meterReadings.id, id))
	// }

	private mountWhere({
		customer_code, start_date, end_date, measure_type
	}: MountWhereParams): SQL[] {
		const where: SQL[] = []

		if (measure_type !== undefined) {
			where.push(eq(meterReadings.measure_type, measure_type))
		}

		if (customer_code !== undefined) {
			where.push(eq(meterReadings.customer_code, customer_code))
		}
		if (start_date !== undefined && end_date !== undefined) {
			const dateCondition = buildPeriodIntervalCondition({
				column: meterReadings.measure_datetime,
				start: start_date,
				end: end_date
			})
			if (dateCondition !== undefined) {
				where.push(dateCondition)
			}
		}

		return where
	}
}