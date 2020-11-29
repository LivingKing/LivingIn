const packageJson = require("../../package.json");

exports.serverHost = () => {
  if (packageJson.state === "PUB") return "https://livingin.herokuapp.com";
  return "http://localhost:8000";
};

exports.clientHost = () => {
  if (packageJson.state === "PUB") return "https://livingin.netlify.app";
  else return "http://localhost:3000";
};
