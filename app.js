await import("dotenv").then((dotenv) => dotenv.config());
import { join, resolve } from "path";
import { default as express } from "express";
const { HOST, PORT } = process.env;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", join(resolve(), "/public"));
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/new", (req, res) => {
  res.render("profile", {
    name: "amalu",
  });
});
// server
app.listen(PORT, HOST, () => {
  console.log("server started at", process.env.PORT);
  console.log(resolve());
});
