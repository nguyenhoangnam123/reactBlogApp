require("dotenv").config();
module.exports = {
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "secret",
  url: "mongodb://localhost:27017/blog",
  port: process.env.REACT_APP_PROXY_PORT || 8080
};
