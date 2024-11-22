
export const responseHandler = ({
	res,
	status = 200,
	msg = '',
	data = {},
	result = true,
}) => {
	res.status(status).send({ result, status, msg, data })
}

export const errorHandler = ({
	res,
	status = 500,
	err = 'error',
	data = {},
	result = false,
}) => {
	console.error(res)
	res.status(status).send({
		result,
		msg: err instanceof Error ? err.message : err,
		data,
	})
}
