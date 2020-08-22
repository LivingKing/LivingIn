const mongoose = require("mongoose");
const db_config = require("../config/db-config.json");

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => console.log("Connected to mongod server"));

mongoose.connect(db_config.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = db;
