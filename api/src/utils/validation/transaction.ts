import * as joi from 'joi'

export default joi.object({
    id: joi.string(),
    amount: joi.number().required(),
    description: joi.string().max(255),
    method: joi.string().valid('pix', 'credit_card'),
    name: joi.string().min(3).max(255),
    cpf: joi.string().regex(/^\d{11}$/).required(),
    card_number: joi.string(),
    card_valid: joi.string(),
    card_cvv: joi.string(),
    created_at: joi.string(),
})