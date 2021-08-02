const express = require('express')
const cors = require('cors')
const exFileUp = require('express-fileupload')
const rotasPet = require('../app/routes/routes-pet')
const app = express()

app.use(exFileUp({createParentPath:true}))
app.use(cors())

rotasPet(app)

app.use((req, resp) => {
    resp.status(404).json({'Mensagem': 'Não foi possível encontrar essa página.'})
})

app.use((error, req, resp, next) => {
    resp.status(500).json({'Mensagem': 'Houve um erro interno no servidor.'})
})

module.exports = app