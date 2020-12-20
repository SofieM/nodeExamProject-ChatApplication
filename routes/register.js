const express = require('express');
const router = require('express').Router();

const fs = require('fs');

const register = fs.readFileSync(__dirname + '/../public/html/register.html').toString();

router.get('/', (req, res) => {
    return res.send(register);
});

module.exports = router;