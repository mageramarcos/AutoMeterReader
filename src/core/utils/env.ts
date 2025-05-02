import joi from 'joi'

type IEnv = {
	NODE_ENV: 'local' | 'production'
	PORT: number
	DATABASE_URL: string
	GEMINI_API_KEY: string
}

const envSchema = joi.object<IEnv>({
	NODE_ENV: joi.string().valid('production', 'local').default('local'),
	PORT: joi.number().default(80),
	DATABASE_URL: joi.string().uri().required(),
	GEMINI_API_KEY: joi.string().required()
})

const validatedEnv = envSchema.validate(process.env, {
	stripUnknown: true
})

if (validatedEnv.error) {
	throw new Error(`Invalid environment variables: ${validatedEnv.error.message}`)
}

export const env = validatedEnv.value