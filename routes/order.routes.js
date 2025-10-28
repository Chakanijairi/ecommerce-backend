const express = require('express')
const { createCheckout, getAllOrder } = require('../controller/order.controller')

const router = express.Router();

router.post('/createCheckout', createCheckout)
router.get('/orders', getAllOrder)


module.exports = router;