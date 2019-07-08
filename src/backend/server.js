const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { port, url } = require("../../config/backend/config");
const router = require("./routes/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

mongoose.set("useCreateIndex", true);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("successfully"))
  .catch((err) => console.log(err.message));

app.listen(port, console.log(`listening to ${port}`));
