const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /products'
    })
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: 'Handling POST request to /products',
        createProduct: product
    })
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    if(id === 'special') {
        res.status(200).json({
            message: 'You found a special ID',
            ID: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

router.patch('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Update successful'
    })
})

router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted sucessfully'
    })
})
module.exports = router;