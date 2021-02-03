const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function (req, res) {

  let type = req.params.type;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningun archivo'
      }
    });
  }

  // Validate type
  let typeValids = ['productos', 'usuarios'];
  if (typeValids.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son ' + typeValids.join(', '),
      }
    });
  }

  // Validate file extension
  let file = req.files.file;
  let fileValidExtensions = ['png', 'jpg', 'gif', 'jpeg'];
  let fileSplitName = file.name.split('.');
  let fileExtension = fileSplitName[fileSplitName.length - 1];
  if (fileValidExtensions.indexOf(fileExtension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + fileValidExtensions.join(', '),
        ext: fileExtension
      }
    });
  }

  // Change file name
  let fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`

  file.mv(`uploads/${type}/${fileName}`, function (err) {
    if (err) return res.status(400).json({ ok: false, err })

    // File loaded
    if (type === 'usuarios') {
      userImage(id, res, fileName);
    } else if (type === 'productos') {
      productImage(id, res, fileName);
    }

  });
});

function userImage(id, res, fileName) {

  Usuario.findById(id, (err, usuarioDB) => {

    if (err) {
      deleteFile(fileName, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      deleteFile(fileName, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    deleteFile(usuarioDB.img, 'usuarios');
    usuarioDB.img = fileName;

    usuarioDB.save((err, usuarioGuardado) => {
      return res.json({
        ok: true,
        usuario: usuarioGuardado
      })
    });
  });

}

function productImage(id, res, fileName) {

  Producto.findById(id, (err, productoDB) => {

    if (err) {
      deleteFile(fileName, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      deleteFile(fileName, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      });
    }

    deleteFile(productoDB.img, 'productos');
    productoDB.img = fileName;

    productoDB.save((err, productoGuardado) => {
      return res.json({
        ok: true,
        producto: productoGuardado
      })
    });
  });

}

function deleteFile(fileName, type) {
  let pathImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
  if (fs.existsSync(pathImage)) {
    fs.unlinkSync(pathImage);
  }
}

module.exports = app;
