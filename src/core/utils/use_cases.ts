import { ProcessOptions, Response, SuccessResponse } from '@utils/response'
import { isHttpException, ServerErrorException } from '@utils/exceptions'
import { functionLogger } from '@utils/logger'

/**
 * Represents a generic use case interface.
 * @template T - The input data type.
 * @template K - The output data type.
 */
export interface IUseCase<T, K> {
	/**
     * Validates the input data for the use case and returns a corresponding T.
     * @param data - The input data.
     * @returns A promise that resolves to a response of type K.
     */
	validate?(data: T): Promise<T>

	/**
     * Executes the use case by processing the input data and returning a response.
     * @param data - The input data.
     * @returns A promise that resolves to a response of type K.
     */
	execute(data: T): Promise<K>
}

/**
 * Represents a wrapped use case that
 *
 * @template T - The type of data that the use case handles.
 * @template K - The type of response that the use case returns.
 */
export interface IWrappedUseCase<T, K> {
	handle(data: T): Promise<Response<K>>
}

/**
 * Represents a handler for executing use cases.
 * @template T The input data type for the use case.
 * @template K The output data type for the use case.
 */
export class UseCaseHandler<T, K> implements IWrappedUseCase<T, K> {
	constructor(private useCase: IUseCase<T, K>) {}

	/**
     * Handles the internal calls of the use case.
     * @param data The input data for the use case.
     * @returns A promise that resolves to the response from the use case execution.
     */
	async handle(data: T): Promise<Response<K>> {
		try {
			const validated = this.useCase.validate !== undefined
				? await this.useCase.validate(data)
				: data
			const result = await this.useCase.execute(validated)

			return new SuccessResponse({ ...result })
		} catch (error) {
			if (isHttpException(error)) {
				return error
			}
			functionLogger({
				data: [error.message],
				function_name: this.useCase.execute.name,
				process: ProcessOptions.FAILED,
				class_name: this.useCase.constructor.name
			})
			return new ServerErrorException(error.message)
		}
	}
}