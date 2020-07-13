const express = require("express");

const db = require("../data/dbConfig.js");
const AccountRouter = require('../accounts/accountRouter.js')

const server = express();

server.use(express.json());

server.use('/api/accounts', AccountRouter)

server.get('/', (req, res) =>{
    res.status(200).json({ api: 'is Up!'})
})

module.exports = server;
