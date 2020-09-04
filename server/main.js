const express = require("express");
const app = express();
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const loginRouter = require("./routes/auth");
const createRouter = require("./routes/create");
const db = require("./libs/db");
const cors = require("cors");

app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.use("/api", apiRouter);
app.use("/auth", loginRouter);
app.use("/create", createRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somthing break");
});

const port = 8000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
