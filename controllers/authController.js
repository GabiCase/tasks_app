const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt-nodejs");
const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos Campos son Obligatorios",
});

//revisar si el user está loggeado

exports.usuarioAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/iniciar-sesion");
};

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

// genera un token si el usuario es válido

exports.enviarToken = async (req, res) => {
  //verificar que existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({
    where: { email },
  });

  // si no hay

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/restablecer");
  }

  //si sí hay

  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

  console.log(resetUrl);

  await enviarEmail.enviar({
    usuario,
    subject: "Password reset",
    resetUrl,
    archivo: "restablecer-password",
  } );
    req.flash('Se ha enviado un mensaje a tu correo')
    res.redirect('/iniciar-sesion')
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash("error", "No es válido");
    res.redirect("/restablecer");
  }
  // formulario para generar un nuevo password
  res.render("resetPassword", {
    nombrePagina: "Restablecer contraseña",
  });
};

//cambiar el antiguo password por otro

exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });

  //verificamos si el user existe
  if (!usuario) {
    req.flash("error", "No es válido");
    res.redirect("/restablecer");
  }
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  await usuario.save();
  req.flash("correcto", "Tu password se ha modificado correctamente");
  res.redirect("/iniciar-sesion");
};
