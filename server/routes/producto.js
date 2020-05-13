const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const Producto = require('../models/producto');
const _ = require('underscore');
const app = express();

// ============================
// Obtener todos los productos
// ============================
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto
        .find({ disponible: true })
        .sort('nombre')
        .limit(limite)
        .skip(desde)
        .populate('usuario', ['nombre', 'email'])
        .populate('categoria', ['descripcion'])
        .exec((err, productos) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.collection.countDocuments({ disponible: true },(err, conteo) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }   
                res.json({
                    ok: true,
                    cantidad: conteo,
                    productos
                });
            });
        });
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto
        .findById(id)
        .populate('usuario', ['nombre', 'email'])
        .populate('categoria', ['descripcion'])
        .exec((err, productoDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });
});

// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //Expresión regular basada en el termino
    let regex = new RegExp(termino,'i');
    Producto
        .find({nombre: regex})
        .populate('usuario', ['nombre', 'email'])
        .populate('categoria', ['descripcion'])
        .exec((err, productos) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

// ============================
// Crear un producto
// ============================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let idUsuario = req.usuario._id;
    let producto = new Producto ({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: idUsuario
    });
    producto.save((err, productoDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creo el producto'
                }
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// ============================
// Actualizar un producto
// ============================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ese id no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ============================
// Borrar un producto
// ============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambioDisponible = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambioDisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        };
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});


module.exports = app;