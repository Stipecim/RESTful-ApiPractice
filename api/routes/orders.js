const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /orders'
    })
});

router.post('/', (req, res, next) => {
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Handling POST request to /orders',
        order: order
    })
});

router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    if(id === 'order') {
        res.status(200).json({
            message: 'You found a order ID',
            ID: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});


module.exports = router;