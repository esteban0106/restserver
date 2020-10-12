const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    }, // no es obligatoria
    role: {
        type: String,
        required: 'USER_ROLE',
        enum: rolesValidos
    }, // default: 'USER_ROLE'
    estado: {
        type: Boolean,
        required: false
    }, //boolean
    google: {
        type: Boolean,
        required: false
    } //boolean
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});
module.exports = mongoose.model('Usuario', usuarioSchema);