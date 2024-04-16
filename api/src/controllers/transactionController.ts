'use strict';

import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { pick } from 'lodash';
import * as TransactionService from '../services/transactionService';

export { getOne, getAll, createOne };

async function getOne(request: Request, response: Response) {
  const transactionId = request.params.id
  try {
    const data = await TransactionService.getOne(transactionId)
    return response.status(HttpStatus.OK).json(data || {})
  } catch (err: any) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_TRANSACTION_GET_ONE',
      message: err.message
    })
  }
}

async function getAll(request: Request, response: Response) {
  try {
    return response.status(HttpStatus.OK).json(
      await TransactionService.getAll()
    )
  } catch (err: any) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_TRANSACTION_ALL',
      message: err.message
    })
  }
}

async function createOne(request: Request, response: Response) {
  let transactionData = pick(request.body, [
    'amount', 'description', 'method', 'name', 'cpf', 'card_number', 'card_valid', 'card_cvv'
  ])
  try {
    return response.status(HttpStatus.CREATED).json(
      await TransactionService.createOne(transactionData)
    )
  } catch (err: any) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_TRANSACTION_CREATE_ONE',
      message: err.message
    })
  }
}
