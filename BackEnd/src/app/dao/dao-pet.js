const { ObjectID } = require("mongodb")

class petDAO{
    gets(){
        return new Promise((resolve, reject) => {
            collectionMongo.find().toArray((err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }

    get(id){
        return new Promise((resolve, reject) => {
            collectionMongo.findOne({"_id": ObjectID(id)}, (err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }

    add(pet){
        return new Promise((resolve, reject) => {
            collectionMongo.insertOne({...pet}, (err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }

    upd(id, dados){
        return new Promise((resolve, reject) => {
            collectionMongo.updateOne(
                {"_id": ObjectID(id)},
                {$set: dados},
                (err, result) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                }
            )
        })
    }

    del(id){
        return new Promise((resolve, reject) => {
            collectionMongo.deleteOne({"_id": ObjectID(id)}, (err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }

}

module.exports = new petDAO()