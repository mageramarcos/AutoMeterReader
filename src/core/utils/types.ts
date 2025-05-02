export type CustomOmit<T, U extends keyof T> = {
	[K in keyof T as K extends U ? never : K]: T[K]
}

export type Require<T, U extends keyof T> = { [P in U]-?: T[P] } & T

export type NonNullableKeys<T, U extends keyof T> = {
	[P in U]: NonNullable<T[P]>
} & CustomOmit<T, U>

export type EmptyObject = Record<string, never>
export type UnknownObject = Record<string, unknown>