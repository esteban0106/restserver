const express = require('express');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion');
const Categoria = require('../modelos/categoria');
const app = express();
const _ = require('underscore');


app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });
});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']); //solo puede actualizar esos datos

    categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    categoria.findByIdAndRemove(id, (err, remove) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!remove) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json(`Categoria ${remove.descripcion} a sido eliminado`);

    });

});

module.exports = app;