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
// 1000 milisegundos
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30;

// ==============================
//  SEED de autenticacion  
// ==============================

process.env.SEED = process.env.SEED || 'seed-desarrollo';

// ==============================
//  Base de datos
// ==============================

if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = 'mongodb+srv://sbonessi:santiago@cluster0.x9opm.mongodb.net/cafe-dev';
} else {
    process.env.URLDB = process.env.MONGO_URL;
}

// ==============================
//  Google Client ID
// ==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '619951824601-ot39cujqjnij1fsjvtbc9ho7cgiue4s1.apps.googleusercontent.com';
