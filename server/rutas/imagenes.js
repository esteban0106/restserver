const express = require('express');
const fs = require('fs');
let app = express();
const Path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagenes/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = Path.resolve(__dirname, `../../upload/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = Path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

});


module.exports = app;