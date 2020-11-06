process.env.PORT = process.env.PORT || 3000;

// ENTORNO  
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//VENCIMIENTO DEL TOKEN
process.env.VEN_TOKEN = '48h';

//SEED
process.env.SEED = process.env.SEED || 'secreto_desarrollo';

//BASE DE DATOS

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/kanda';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '596535622846-0mrj6hmdda9hn8om7p48e8rhm06njbcj.apps.googleusercontent.com';