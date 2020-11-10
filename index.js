const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
require("dotenv").config({ path: ".env" });
//const expressValidator = require( 'express-validator' );

// helpers
const helpers = require("./helpers");

//Crear la conexión a la BD
const db = require("./config/db");

// Importar el modelo
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("Conec"))
  .catch((err) => console.log(err));
//crear una app de express
const app = express();

// Habilitar bodyParser para leer datos de formularios
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Dónde cargar los archivos estáticos
app.use(express.static("public"));
// Habilitar pug
app.set("view engine", "pug");
//Añadir la carpeta de las vistas
app.set("views", path.join(__dirname, "./views"));

//flash messages
app.use(flash());

app.use(cookieParser());

// sesiones
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// pasar var dump a la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  next();
});

app.use("/", routes());

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log("Servidor funcionando");
});
