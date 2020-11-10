const express = require("express");
const router = express.Router();

//importar express validator
const { body } = require("express-validator/check");

const projectsController = require("../controllers/projectController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
module.exports = function () {
  router.get(
    "/",
    authController.usuarioAutenticado,
    projectsController.proyectosHome
  );
  router.get(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    projectsController.formularioProyecto
  );
  router.post(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    body("nombre").not().isEmpty().trim().escape(),
    projectsController.nuevoProyecto
  );

  // Editar proyecto
  router.get(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    projectsController.proyectoPorUrl
  );

  router.get(
    "/proyecto/editar/:id",
    authController.usuarioAutenticado,
    projectsController.formularioEditar
  );
  router.post(
    "/nuevo-proyecto/:id",
    authController.usuarioAutenticado,
    body("nombre").not().isEmpty().trim().escape(),
    projectsController.actualizarProyecto
  );

  //eliminar proyecto
  router.delete(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    projectsController.eliminarProyecto
  );

  //Tareas
  router.post(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );

  //Actualizar Tarea
  router.patch(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );

  //Eliminar Tarea
  router.delete(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // Crear nueva cuenta
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearCuenta);
  router.get("/confirmar/:correo", usuariosController.confirmarCuenta);
  //iniciar sesion
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  router.get("/cerrar-sesion", authController.cerrarSesion);

  router.get("/restablecer", usuariosController.formRestablecerPassword);
  router.post("/restablecer", authController.enviarToken);
  router.get("/restablecer/:token", authController.validarToken);
  router.post("/restablecer/:token", authController.actualizarPassword);

  return router;
};
