import { NextFunction, Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import TransactionValidationRules from '../utils/validation/transaction'

export default async function (request: Request, response: Response, next: NextFunction) {
    const { body } = request
    try {
        await TransactionValidationRules.validateAsync(body)
        next()
    }
    catch (err: any) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            errorCode: 'ERR_500_TRANSACTION_INVALID_FIELDS',
            message: err['details'][0].message
        })
    }
}