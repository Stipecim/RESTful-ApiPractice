         //express
const express = require('express');
const router = express.Router();
//-----------------------------
const bcrypt = require('bcrypt');
const generateUniqueID = require('../utils/generateUID');
const LOCALDB = require('../../localdb/sqlocal');
const userEmails = require('./userEmails.json');
const path = require('path');
const fs = require('fs');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    const id = generateUniqueID();

    let isFound = false;
    userEmails.forEach(email => {
        if(email === req.body.email) isFound = true;
    });

    if(isFound) return res.status(422).json({
        message: "User Already exists."
    });
    bcrypt.hash(req.body.password, 10,(err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        }else {
            const user = User(
                id, 
                req.body.email, 
                hash
            );
            const localdb = new LOCALDB();
            sql = "INSERT INTO Users(userID, userEmail, userPassword) VALUES (?,?,?)";


            localdb.WriteToDB(sql, [user._id, user.email, user.password], (err) => {
                if(err) {
                    console.error("Error writing to database", err);
                    return res.status(500).json({
                        status: 500,
                        success: false,
                        error: "Internal Server Error"
                    });
                }else {

                    userEmails.push(user.email);
                    fs.promises.writeFile(path.resolve(__dirname, 'userEmails.json'), JSON.stringify(userEmails, null, 2), 'utf8');

                    
                    return res.json({
                        message: "Succesfully added user to Database",
                        userID: user._id,
                        Email: user.email
                    });
                }
            });
        }
    });

});
router.post('/login', (req, res, next) => {
    
});
router.delete('/:userID', (req, res, next) => {
    const localdb = new LOCALDB();
    sql = "DELETE FROM Users WHERE userID = ?";

    localdb.DeleteFromDB(sql, req.params.userID, (err, data) => {
        if(err) {
            console.error("Error writing to database", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: "Internal Server Error, possibly wrong userID"
            });
        }

        return res.json({
            message: "successfuly deleted the item!",
            request: {
                type: "POST",
                url: "http://localhost:3000/user/signup",
                body: {
                    email: "String",
                    password: "ammount"
                }
            }
        });
        
    });
});
 module.exports = router;