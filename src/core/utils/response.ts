export enum ProcessOptions {
	SUCCESS = 'success',
	FAILED = 'failed'
}

type ISuccessResponse<T> = {
	body: T
	process: ProcessOptions.SUCCESS
	status_code: number
}

export type IFailedResponse = {
	body: string
	process: ProcessOptions.FAILED
	status_code: number
}

export type Response<T> = ISuccessResponse<T> | IFailedResponse

export class SuccessResponse<T> {
	process: ProcessOptions.SUCCESS = ProcessOptions.SUCCESS
	status_code: number = 200
	body: T

	constructor(data: T) {
		this.body = data
	}
}