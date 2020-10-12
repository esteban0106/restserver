process.env.PORT = process.env.PORT || 3000;

// ENTORNO  

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/kanda';
} else {
    urlDB = 'mongodb+srv://kanda:7bPwgn6AVfMNPfzh@cluster0.7nag6.mongodb.net/kanda'
}

process.env.URLDB = urlDB;