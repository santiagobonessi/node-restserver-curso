const moongose = require('mongoose');

let Schema = moongose.Schema;
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true,'La descripcion es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }
});

module.exports = moongose.model('Categoria', categoriaSchema);
