const app = require('./src/config/custom-express')
const mongo = require('./src/config/database')

mongo.cliente.connect(mongo.uri, function(err, client){
    if(err){
        throw err
    }else{
        const dbMongo = client.db(mongo.database)
        collectionMongo = dbMongo.collection(mongo.collection)
        collectionMongo.createIndex({cpf: 1, nomePet: 1}, {unique: true})

        app.listen(5000, () => {
            console.log('Ouvindo na porta 5000.')
        })
    }

})