require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.set('useFindAndModify', false);

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json (middleware)
app.use(bodyParser.json());

app.use( require('./routes/usuario') );

mongoose.connect('mongodb://localhost:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (err) throw err;
  console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando por el puerto', process.env.PORT);
});
