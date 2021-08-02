const petController = require('../controller/controller-pet')
const petModel = require('../model/model-pet')

module.exports = (app) => {
    app.route(petController.routes().base)
        .get(petController.gets())
        .post(petModel.validation(), petController.add())
    app.route(petController.routes().id)
        .get(petController.get())
        .delete(petController.del())
        .put(petModel.validation(), petController.upd())
}