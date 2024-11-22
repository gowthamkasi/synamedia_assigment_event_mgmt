import Joi from 'joi'

export default async (payload, key) => {
  const schema = JoiSchema[key]

  const validate = schema.validate(payload)
  let error = false
  let message = 'Success Validation'

  if (validate.error) {
    message = validate.error.details[0].message
    message = message.replace(/"/g, '')
    error = true
  }

  return { error, message }
}

const reserveTicket = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  eventDate: Joi.date().required(),
})

const cancelReservation = Joi.object({
  email: Joi.string().email().required(),
  eventDate: Joi.date().required(),
})

const modifyReservation = Joi.object({
  email: Joi.string().email().required(),
  eventDate: Joi.date().required(),
})

const JoiSchema = {
  reserveTicket,
  cancelReservation,
  modifyReservation
}





