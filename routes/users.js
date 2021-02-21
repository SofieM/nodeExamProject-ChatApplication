const express = require('express');
const router = require('express').Router();
const database = require('../utils/dbconnection');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");
const saltRounds = 12;

//returnerer alle users fra db
router.get('/', (req, res) => {
    database.query("SELECT username, email from users", (error, result, fields) => {
        if (error) {
            res.send('Error', error);
            res.redirect('../');
        } else {
            return res.send(JSON.stringify(result));
        }
    });
});

//opretter ny user i db
router.post('/', async (req, res) => {
    const signup_username = req.body.signup_username;
    const signup_email = req.body.signup_email;
    const signup_password = req.body.signup_password;

    const encryptedPassword = await bcrypt.hash(signup_password, saltRounds);

    let user = {
        'username': signup_username,
        'email': signup_email,
        'password': encryptedPassword
    };

    database.query("INSERT INTO users SET ?", user, (error, results, fields) =>{
        if (error) {
            res.send('Error', error);
            res.redirect('../register');
        } else {
            res.redirect('../login');
        }
    });
});

module.exports = router;