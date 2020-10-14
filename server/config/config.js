process.env.PORT = process.env.PORT || 3000;

// ENTORNO  
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//VENCIMIENTO DEL TOKEN
process.env.VEN_TOKEN = 60 * 60 * 24 * 30;

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

process.env.CLIENT_ID = process.env.CLIENT_ID || '748225909020-n5vv3j00huresl8nsh5t27acgubbjqnn.apps.googleusercontent.com';