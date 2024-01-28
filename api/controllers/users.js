const generateUniqueID = require('../utils/generateUID');
const LOCALDB = require('../../localdb/sqlocal');
const userEmails = require('./userEmails.json');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.Users_create_user = (req, res, next) => {
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
}

exports.Users_login_user = (req, res, next) => {
    let isFound = false;
    
    userEmails.forEach(email => {
        if(email === req.body.email) isFound = true;
    });

    if(isFound) {
        const localdb = new LOCALDB();

        sql = 'SELECT * FROM Users WHERE userEmail = ?';

        localdb.RreadFromDB(sql, req.body.email, (err, data) => {
            if(err) {
                console.error("Error writing to database", err);
                return res.status(500).json({
                    status: 500,
                    success: false,
                    error: "Internal Server Error"
                });
            }else {

                bcrypt.compare(req.body.password, data.userPassword, (err, result) => {
                    if(err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if(result) {
                        const token = jwt.sign({
                            email: data.userEmail,
                            userID: data.userID,
                        },process.env.JWT_KEY, {
                            expiresIn: "1h"
                        });
                        return res.status(401).json({
                            message: "Auth Successful",
                            token: token
                        });
                    }
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                });
            }
        });

    }else {
        return res.status(401).json({
            message: 'Auth fail'
        });
    }
}

exports.Users_delete_user = (req, res, next) => {
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
            message: "User removed",
            request: {
                type: "POST",
                url: "http://localhost:3000/user/signup",
                body: {
                    email: "String",
                    password: "123"
                }
            }
        });
        
    });
}