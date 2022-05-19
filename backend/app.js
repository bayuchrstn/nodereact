require("dotenv").config();
var express = require("express");
var path = require("path");
const cors = require("cors")
var cookieParser = require("cookie-parser");
var logger = require("morgan");
global.__basedir = __dirname;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var generalRouter = require("./routes/general");

var app = express();

app.use(cors({ origin:'http://localhost:3000',credentials:true,optionSuccessStatus:200 }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/general", generalRouter);

module.exports = app;
