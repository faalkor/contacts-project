const mongoose = require('mongoose');

const KittySchema = new mongoose.Schema({
    name: { type: String, required: true },
    especie: { type: String },
});


const KittenModel = mongoose.model('Kitten', KittySchema);

module.exports = KittenModel;

class Kitten {

}

//module.exports = Kitten;
