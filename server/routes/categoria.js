const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/authentication');
const app = express();

// ============================
// Obtener todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria
        .find()
        .sort('descripcion')
        .populate('usuario',['nombre', 'email'])
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.collection.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    cantidad: conteo,
                    categorias
                });
            });
        });
});

// ============================
// Obtener una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria
        .findById(id)
        .populate('usuario',['nombre', 'email'])
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe esa categoria'
                    }
                });
            }
            return res.json({
                ok: true,
                categoriaDB
            });
        });
});

// ============================
// Crear una categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let idUsuario = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUsuario
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creo la categoria'
                }
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Actualizar una categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ese id no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Borrar una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, cateogriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!cateogriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ese id no existe'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: cateogriaDB
        });
    });
});

module.exports = app;
