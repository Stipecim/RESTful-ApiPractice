const express = require('express');
const router = express.Router();
const orderModel = require('../models/order');
const generateUniqueID = require('../utils/generateUID');
const productIDs = require('./productIDs.json');
const orderIDs = require('./orderIDs.json');
const LOCALDB = require('../../localdb/sqlocal');
const fs = require('fs');
const path = require('path');


router.get('/', (req, res, next) => {
    const localdb = new LOCALDB();
    sql = "SELECT * FROM Orders INNER JOIN Product ON Orders.productID = Product.productID";

    localdb.ReadAllDB(sql, (err, data) => {
        if(err) {
            console.error("Error reading to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }
        
        console.log(data);
        if(data && data.length > 0) {
           
            const responseData = data.map(order => ({
                id: order.ID,
                productID: order.productID,
                productName: order.name,
                quantity: order.quantity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/order/" + order.ID
                },
                post_request: {
                    type: "POST",
                    url: "http://localhost:3000/order",
                    body: {
                        productID: "id from a product",
                        quantity: "ammount"
                    }
                }
            }));
           
           return res.json({responseData});
            
        }else {
            return res.json({
                status: 404,
                success: false,
                error: "No Orders found"
            })
        }
    })

});

router.post('/', (req, res, next) => {
    

    // Generating unique Order id
    const id = generateUniqueID();


    const productID = req.body.id; // get productID
    const order = orderModel(id, req.body.productID, req.body.quantity);

        // look for productID
    if(order.productID === undefined) {
        res.status(301).json({
            message: 'Error: ProductID must initialized'
        })
    }
    
    let isIDfound = false;
    productIDs.forEach((element,index) => {
        if(element === order.productID) isIDfound = true;
    });
    
    if(!isIDfound) res.status(301).json({
        message: 'Error: ProductID: not found'
    })
// ----------------------------------------------
    const localdb = new LOCALDB();
    sql = "INSERT INTO Orders(ID, productID, quantity) VALUES (?,?,?)";

    localdb.WriteToDB(sql, [order._id, order.productID, order.quantity], (err) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }else {

            orderIDs.push(id);
            
            fs.promises.writeFile(path.resolve(__dirname, 'orderIDs.json'), JSON.stringify(orderIDs, null, 2), 'utf8');

                //creating response message after success
            
            const responseData = ({
                message: 'Succesfully created',
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/order/" + order._id
                }
            });
            console.log('ID added to OrderIDs'); // -Dev
            return res.json({responseData});
        }
    });
});

router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    
         // look for OrderID
    
    let isIDfound = false;
    orderIDs.forEach((element,index) => {
        if(element === id) isIDfound = true;
    });
    
    if(!isIDfound) res.status(301).json({
        message: 'Error: OrderID: not found'
    })
// ----------------------------------------------
    const localdb = new LOCALDB();
    sql = "SELECT * FROM Orders INNER JOIN Product ON Orders.productID = Product.productID WHERE Orders.ID = ?";

    localdb.RreadFromDB(sql, id, (err, data) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }
    
        // if(data === undefined) return res.json({
        //     status: 404,
        //     success: false,
        //     error: "ID not found"
        // });
        console.log(data);
        return res.json({
            id: data.ID,
            productID: data.productID,
            productName: data.name,
            quantity: data.quantity,
            request: {
                type: "GET",
                url: "http://localhost:3000/order/" + data.ID
            }
        });
    });

});

router.delete('/:orderID', (req, res, next) => {
    const id = req.params.orderID;

    // look for OrderID    
    let isIDfound = false;
    orderIDs.forEach((element,index) => {
        if(element === id) isIDfound = true;
    });

    if(!isIDfound) return res.status(301).json({
        message: 'Error: OrderID: not found'
    })
 // ----------------------------------------------

    const localdb = new LOCALDB();
    sql = "DELETE FROM Orders WHERE ID = ?";

    localdb.DeleteFromDB(sql, id, (err, data) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }

        return res.json({
            message: "successfuly deleted the item!",
            request: {
                type: "POST",
                url: "http://localhost:3000/order",
                body: {
                    productID: "String",
                    quantity: "ammount"
                }
            }
        });
        
    });
});

module.exports = router;