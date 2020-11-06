const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../modelos/producto');
const app = express();
const _ = require('underscore');
const producto = require('../modelos/producto');

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


app.get('/producto', verificaToken, (req, res) => {

    Producto.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: productoDB
            });

        });
});

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });

    });
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: productoDB
            });

        });
});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precio', 'descripcion', 'disponible']); //solo puede actualizar esos datos

    producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });
    });

});

app.delete('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, remove) => {
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
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json(`Producto ${remove.nombre} a sido eliminado`);

    });

});

module.exports = app;