const petDAO = require('../dao/dao-pet')
const {validationResult} = require('express-validator')

const objInex = {"Mensagem": "Página inexistente!"}
const objErr = {"Mensagem": "Houve um erro na solicitação"}


class petController{

    routes(){
        return {
            'base': '/app/pets/',
            'id': '/app/pets/:id'
        }
    }

    gets(){
        return function(req, resp){
            petDAO.gets()
                .then((resultado) => resp.json(resultado))
                .catch((erro) => resp.status(500).json(objErr))
        }
    }

    get(){
        return function(req, resp){
            petDAO.get(req.params.id)
                .then((resultado) => {
                    if(resultado){
                        resp.json(resultado)
                    }else{
                        resp.status(404).json(objInex)
                    }
                })
                .catch((erro) => resp.status(500).json(objErr))
        }
    }

    add(){
        return function(req, resp){
            const erros = validationResult(req).array()
            if(erros.length != 0){
                resp.status(422).json(erros)
            }else{
                if(!req.files){
                    resp.status(422).json({'Mensagem': 'É necessário fazer o upload de uma imagem'})
                }else if(!req.files.foto.mimetype.startsWith('image')){
                    resp.status(422).json({'Mensagem': 'Arquivo inválido. É necessário fazer o upload de uma imagem'})
                }else{
                    const foto = req.files.foto
                    const path = '../public/' + foto.name

                    foto.mv(path, (err) => {
                        if(err){
                            resp.status(500).json(err)
                        }
                    })
                    req.body.pathImg = path
                    petDAO.add(req.body)
                        .then((resultado) => resp.status(201).json({"Mensagem": 'Pet cadastrado com sucesso'}))
                        .catch((erro) => resp.status(500).json(erro))
                }
            }
        }
    }

    upd(){
        return function(req, resp){
            const erros = validationResult(req).array()
            if(erros.length != 0){
                resp.status(422).json(erros)
            }else{
                if(req.files){
                    if(!req.files.foto.mimetype.startsWith('image')){
                        resp.status(422).json({'Mensagem': 'Arquivo inválido. É necessário fazer o upload de uma imagem'})
                    }else{
                        const foto = req.files.foto
                        const path = '../public/' + foto.name

                        foto.mv(path, (err) => {
                            if(err){
                                resp.status(500).json(err)
                            }
                        })

                        req.body.pathImg = path
                    }
                }
                petDAO.upd(req.params.id, req.body)
                    .then((resultado) => {
                        if(resultado.result.n > 0){
                            resp.json({"Mensagem": "Pet atualizado com sucesso"})
                        }else{
                            resp.status(404).json(objInex)
                        }    
                    })
                    .catch((erro) => resp.status(500).json(erro))
            }
        }
    }


    del(){
        return function(req, resp){
            petDAO.del(req.params.id)
                .then((resultado) => {
                    if(resultado.result.n > 0){
                        resp.json({"Mensagem": "Pet removido com sucesso"})
                    }else{
                        resp.status(404).json(objInex)
                    }    
                })
                .catch((erro) => resp.status(500).json(objErr))
        }
    }

}

module.exports = new petController()