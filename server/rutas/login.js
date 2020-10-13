const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../modelos/usuario');
const jwt = require('jsonwebtoken');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El (Usuario) o la Contraseña estan incorrecta'
                }
            });

        };

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Usuario o (la Contraseña) estan incorrecta'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.VEN_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });

    });
});





module.exports = app;