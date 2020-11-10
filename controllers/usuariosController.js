const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear Cuenta",
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar Sesion",
    error,
  });
};

exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body;

  try {
    await Usuarios.create({
      email,
      password,
    });

    // crear url de confirmación
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    //crear usuario
    const usuario = {
      email,
    };
    // enviar mail
    await enviarEmail.enviar({
      usuario,
      subject: "Confirma tu cuenta",
      confirmarUrl,
      archivo: "confirmar-cuenta",
    });
    //redirigir al usuario
    req.flash("correcto", "Confirma tu cuenta por medio de tu correo");

    res.redirect("/iniciar-sesion");
  } catch(error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      nombrePagina: "Crear Cuenta",
      mensajes: req.flash(),
      email,
      password,
    });
  }
};

exports.formRestablecerPassword = (req, res) => {
  res.render("restablecer", {
    nombrePagina: "Restablecer tu Contraseña",
  });
};

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo,
    },
  });

  if (!usuario) {
    req.flash("error", "No válido");
    res.redirect("/crear-cuenta");
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash("correcto", "Cuenta activada");
  res.redirect("/iniciar-sesion");
};