const express = require("express");
const app = express();
const compression = require("compression");
const helmet = require("helmet");
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/auth");
const registerRouter = require("./routes/register");
const db = require("./db/db");
const cors = require("cors");

app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(express.static("public"));

app.use("/api", indexRouter);
app.use("/auth", loginRouter);
app.use("/register", registerRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somthing break");
});

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
