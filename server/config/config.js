// ==============================
//  Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000;


// ==============================
//  Entorno
// ==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
//  Vencimiento del token
// ==============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==============================
//  SEED de autenticacion  
// ==============================

process.env.SEED = process.env.SEED || 'seed-desarrollo';

// ==============================
//  Base de datos
// ==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;

// ==============================
//  Google Client ID
// ==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '619951824601-ot39cujqjnij1fsjvtbc9ho7cgiue4s1.apps.googleusercontent.com';
