const express = require('express');
const router = express.Router();
const LOCALDB = require('../../localdb/sqlocal');
const generateUniqueID = require('generate-unique-id');


let sql;


router.get('/', (req, res, next) => {
    const localdb = new LOCALDB();
    sql = "SELECT * FROM Product";

    localdb.ReadAllDB(sql, (err, data) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }
        
        console.log(data);
        if(data && data.length > 0) {
           
            const responseData = data.map(product => ({
                id: product.ID,
                name: product.name,
                price: product.price,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + product.ID
                }
            }));
           
           return res.json({responseData});
            
        }else {
            return res.json({
                status: 404,
                success: false,
                error: "No items found in Products"
            })
        }
    })

});

router.post('/',  (req, res, next) => {
        const localdb = new LOCALDB();
        const id = generateUniqueID({
            useLetters: true,
            useNumbers: true,
        });
        ;
       
        const data = [
            id,
            req.body.name,
            req.body.price
        ];

        sql = "INSERT INTO Product(ID,name, price) VALUES (?,?,?)";

        if(!data[1] || !data[2]) return res.json({
            status: 301,
            message: "you need to include name and price"
        });

        if(!Number.isInteger(data[2])) return res.json({
            status: 302,
            message: "number has to be integer "
        });

        localdb.WriteToDB(sql, data, (err) => {
            if(err) {
                console.error("Error writing to database", err);
                return res.status(500).json({
                    status: 500,
                    success: false,
                    error: "Internal Server Error"
                });
            }

            const [ID, name, price] = data;
            const responseData = ({
                message: 'Succesfully created',
                id: ID,
                name: name,
                price: price,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + ID
                }
            });
            return res.json({responseData});
        });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    sql = 'SELECT * from Product WHERE ID = ?';
    const localdb = new LOCALDB();

    localdb.RreadFromDB(sql, id, (err, data) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }
       
        if(data === undefined) return res.json({
            status: 404,
            success: false,
            error: "ID not found"
        });
        console.log("hello");
        return res.json({
            id: data.ID,
            name: data.name,
            price: data.price,
            request: {
                type: "GET",
                url: "http://localhost:3000/products" + data.ID
            }
        });
    });
});

router.patch('/:productID', (req, res, next) => {
    const localdb = new LOCALDB();
    
    const id = req.params.productID;
    const updateOps = req.body;
    
    console.log(updateOps);
    updateOps.forEach(update => {
        const {propsName, value} = update;
        console.log(value);
        sql = `UPDATE Product SET ${propsName} = ? WHERE ID = ?`;
        localdb.PatchDB(sql, {id, [propsName]: value}, (err) => {
            if(err) console.error("Error updating item: ", err);
        });
    });
    const responseData = ({
        message: 'Succesfully updated',
        request: {
            type: "GET",
            url: "http://localhost:3000/products/" + id
        }
    });
    return res.json(responseData);
})

router.delete('/:productID', (req, res, next) => {
    const localdb = new LOCALDB();
    sql = "DELETE FROM Product WHERE ID = ?";
    const id = req.params.productID;

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
                url: "http://localhost:3000/products/",
                data: {
                    name: "String",
                    price: "INTEGER"
                }
            }
        });
        
    });



})
module.exports = router;