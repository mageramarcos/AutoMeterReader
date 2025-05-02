import { AnySchema } from 'joi'

interface IisValidError {
	isValid: false
	error: string
}

interface IisValidSuccess<T> {
	isValid: true
	data: T
}

type IisValid<T> = IisValidError | IisValidSuccess<T>

const validator = async<T>(
	schema: AnySchema, data: T
): Promise<IisValid<T>> => {
	try {
		const value = await schema.validateAsync(data, { stripUnknown: true })
		return {
			isValid: true,
			data: value
		}
	} catch (error) {
		return {
			isValid: false,
			error: error.message
		}
	}
}

export default validator