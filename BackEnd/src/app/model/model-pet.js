const {check} = require('express-validator')

class petModel{

    validation(){
        return [
            check('cpf').trim().custom((cpf) => cpf.match(/(\d{3}\.{1}){2}\d{3}-\d{2}/)).withMessage('CPF inválido. Utilize o formato XXX.XXX.XXX-XX'),
            check('nome').trim().isLength({min: 3}).withMessage('Nome do dono inválido. Utilize pelo menos 3 caracteres'),
            check('nomePet').trim().isLength({min: 3}).withMessage('Nome do animal inválido. Utilize pelo menos 3 caracteres'),
            check('raca').trim().isLength({min: 3}).withMessage('Raça do animal inválida. Utilize pelo menos 3 caracteres'),
            check('data').custom((data) => data.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)).withMessage('Data inválida. Utilize uma data válida.'),
        ]
    }
}

module.exports = new petModel()