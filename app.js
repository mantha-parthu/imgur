import { default as express } from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("hey it is working");
});
app.listen(3000);
