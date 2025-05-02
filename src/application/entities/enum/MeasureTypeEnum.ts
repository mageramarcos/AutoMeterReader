export enum MeasureTypeEnum {
	WATER = 'WATER',
	GAS = 'GAS'
}

export type MeasureType = keyof typeof MeasureTypeEnum