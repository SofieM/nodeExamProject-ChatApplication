const express = require('express');
const router = require('express').Router();

const fs = require('fs');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const chat = fs.readFileSync(__dirname + '/../public/html/chat.html').toString();

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.send(chat);
    } else {
        res.send('Please login to view this page!');
    }
});

module.exports = router;