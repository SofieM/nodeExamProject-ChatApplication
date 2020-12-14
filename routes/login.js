const express = require('express');
const router = require('express').Router();

const fs = require('fs');
const database = require('../utils/dbconnection');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");

const login = fs.readFileSync(__dirname + '/../public/login.html').toString();

router.get('/', (req, res) => {
    return res.send(login);
});

router.post('/', (req, res) => {
    let username = req.body.login_username
    let password = req.body.login_password;
    database.query('SELECT * FROM users WHERE username = ?',[username],  (error, results, fields) => {
        if (error) {
            res.send({
                "code":400,
                "failed":"error ocurred"
            })
        }else{
            if(results.length > 0){
                const hashedPassword = results[0].password;
                let match = bcrypt.compareSync(password, hashedPassword);
                if(match){
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('./chat');
                }
                else{
                    res.send({
                        "code":204,
                        "success":"Username and password does not match"
                    })
                }
            }
            else{
                res.send({
                    "code":206,
                    "success":"Username does not exits"
                });
            }
        }
    });
});

module.exports = router;