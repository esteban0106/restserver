const jwt = require('jsonwebtoken');

//Verificar Token

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};


let verificaRole = (req, res, next) => {

    let usuario = req.usuario;
    let role = usuario.role;

    console.log(usuario);

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Solo esta activo para administradores'
            }
        });
    }
    next();



}

module.exports = {
    verificaToken,
    verificaRole
}