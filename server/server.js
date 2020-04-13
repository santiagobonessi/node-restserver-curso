require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json (middleware)
app.use(bodyParser.json());

// configuracion global de rutas
app.use( require('./routes/index') );

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err, res) => {
  if (err) throw err;
  console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando por el puerto', process.env.PORT);
});
