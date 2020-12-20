const express = require('express');
const router = require('express').Router();
const database = require('../utils/dbconnection');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");
const saltRounds = 12;

router.get('/', (req, res) => {
    //BLIVER IMPLEMENTERET INDEN EKSAMEN
    //skal returnere alle users (når fetch er implementeret på klient-siden)
    //Users skal hentes fra databasen - returneres som json til klienten (som fetcher) - vises på chat-siden
    return res.send([{name:'Sofie', email: 'sofie@email.com'}]);
});

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