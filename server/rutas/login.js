const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../modelos/usuario');
const jwt = require('jsonwebtoken');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'login.js line 20'
                }
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

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'login.js line 95'
                }
            });
        };

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.VEN_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            //Si el usuario no exite en nuestra base de datos
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)'
            });

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.VEN_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });

        }

    });

});




module.exports = app;