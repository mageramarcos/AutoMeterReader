import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const randomID = (size?: number): string => {
	const nanoid = customAlphabet(alphabet, size ?? 12)
	return nanoid()
}

export const generateUUID = (): string => {
	return crypto.randomUUID()
}