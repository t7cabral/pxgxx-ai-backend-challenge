'use strict'

import { Router } from 'express'
import * as TransactionController from '../controllers/transactionController'
const xss_sanitize = require('../middlewares/xss_sanitize.js')
import validate_transaction_data from '../middlewares/validate_transaction_data'

const router = Router()

router.get('/:id', TransactionController.getOne)

router.get('/', TransactionController.getAll)

router.post('/', xss_sanitize, validate_transaction_data, TransactionController.createOne)

export default router
