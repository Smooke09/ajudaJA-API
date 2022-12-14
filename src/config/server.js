const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const allowCors = require("./cors");
const routes = require("../routes/index");
const app = express();
const apiErrorHandler = require("../error/errorHandler");
const { Server } = require("socket.io");
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Swagger desse jetio para funcionar na vercel
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(allowCors);

const ROOT_FOLDER = path.join(__dirname, "..");
app.use(express.static(path.join(ROOT_FOLDER, "public")));

//EndPoint
app.use("/api", routes);
// Middleware de tratamento de erros
app.use(apiErrorHandler);

const options = {
  customCssUrl: "/swagger-ui.css",
  customSiteTitle: "API AjudaJA swagger",
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

module.exports = { server, io };
