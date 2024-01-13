const express = require('express');
const router = express.Router();
const LOCALDB = require('../../localdb/sqlocal');

const localdb = new LOCALDB();
let sql;


router.get('/', (req, res, next) => {

    res.status(200).json({
        message: 'Handling GET request to /products'
    })
});

router.post('/',  (req, res, next) => {
        const data = [
            req.body.name,
            req.body.price
        ];
        sql = "INSERT INTO Product(name, price) VALUES (?,?)";
       
        localdb.WriteToDB(sql, data, (err) => {
            if(err) {
                console.error("Error writing to database", err);
                return res.status(500).json({
                    status: 500,
                    success: false,
                    error: "Internal Server Error"
                });
            }

            return res.json({
                message: 'Handling GET request to /products',
                success: true,
                name: req.body.name,
                price: req.body.price
            });
        });
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