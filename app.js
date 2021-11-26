await import("dotenv").then((dotenv) => dotenv.config());
import mongoose from "mongoose";
import { join, resolve } from "path";
import { default as express } from "express";
import bodyParser from "body-parser";
const { HOST, PORT } = process.env;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", join(resolve(), "/public"));
const dblink = `mongodb+srv://dev:passmein@cluster0.gsr2u.mongodb.net/imgur?retryWrites=true&w=majority`;
mongoose.connect(dblink).then(() => {
  console.log("database connection succesfull");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/new", (req, res) => {
  let { user } = req.body;
  res.render("profile", {
    name: user,
  });
});
// server
app.listen(PORT, HOST, () => {
  console.log("server started at", process.env.PORT);
  console.log(resolve());
});
