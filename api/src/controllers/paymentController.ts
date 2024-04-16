'use strict';

import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import * as PaymentService from '../services/paymentService'

export { getSummary }

async function getSummary(request: Request, response: Response) {
    try {
        const result = await PaymentService.getSummary()
        return response.status(HttpStatus.OK).json(Object.assign({paid: 0, waiting_funds: 0}, result))
    } catch (err: any) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errorCode: 'ERR_500_PAYMENT_GET_SUMMARY',
          message: err.message
        })
    }
}
