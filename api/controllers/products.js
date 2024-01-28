const LOCALDB = require('../../localdb/sqlocal');
const generateUniqueID = require('../utils/generateUID');
const fs = require('fs');
const path = require('path');
const productIDs = require('./productIDs.json');

let sql;

exports.Producs_get_all = (req, res, next) => {
    const localdb = new LOCALDB();
    sql = "SELECT * FROM Product";

    localdb.ReadAllDB(sql, (err, data) => {
        if(err) {
            console.error("Error reading from database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }
        
        console.log(data);
        if(data && data.length > 0) {
           
            const responseData = data.map(product => ({
                id: product.productID,
                name: product.name,
                price: product.price,
                productImage: product.productImage,
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
}

exports.Products_create_product = (req, res, next) => {
        
    const localdb = new LOCALDB();
    const id = generateUniqueID();
    
    const data = [
        id,
        req.body.name,
        req.body.price,
        req.file.path
    ];
    console.log(req.body.name);
    sql = "INSERT INTO Product(productID,name, price, productImage) VALUES (?,?,?,?)";

    if(!data[1] || !data[2]) return res.json({
        status: 301,
        message: "you need to include name and price"
    });

    if(!Number.isInteger(data[2])) {
        data[2] = parseFloat(data[2]);
    }
    

    localdb.WriteToDB(sql, data, (err) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error"
            });
        }else {

            productIDs.push(id);

            fs.promises.writeFile(path.resolve(__dirname,'productIDs.json'), JSON.stringify(productIDs, null, 2), 'utf8');

                //creating response message after success
            const [ID, name, price, productImage] = data;
            const responseData = ({
                message: 'Succesfully created',
                id: ID,
                name: name,
                price: price,
                productimage: productImage,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + ID
                }
            });
            console.log('ID added to ProductIDs'); // -Dev
            return res.json({responseData});
        }
    });
}

exports.Products_get_product = (req, res, next) => {
    const id = req.params.productID;
    sql = 'SELECT * from Product WHERE productID = ?';
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
            productImage: data.productImage,
            request: {
                type: "GET",
                url: "http://localhost:3000/products" + data.ID
            }
        });
    });
}

exports.Products_patch_product = (req, res, next) => {
    const localdb = new LOCALDB();
    
    const id = req.params.productID;
    console.log(id);
    const updateOps = req.body;
    
    console.log(updateOps);
    updateOps.forEach(update => {
        const {propsName, value} = update;
        console.log(value);
        sql = `UPDATE Product SET ${propsName} = ? WHERE productID = ?`;
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
}

exports.Products_delete_prodcut = (req, res, next) => {
    const localdb = new LOCALDB();
    sql = "DELETE FROM Product WHERE productID = ?";
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
}