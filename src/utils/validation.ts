import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'

const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped()
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg.message && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        errorsObject[key]['msg'] = msg.message
        return res.status(msg.status).json({ errors: errorsObject })
      }
    }
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped() })
  }
}

export default validate
