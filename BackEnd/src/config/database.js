const cliente = require('mongodb').MongoClient

const uri = 'mongodb://localhost:27017'
const database = 'petshop'
const collection = 'dados'

module.exports = {cliente, uri, database, collection}