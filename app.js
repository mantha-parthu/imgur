import { default as express } from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hey it is working");
});
app.listen(PORT, () => {
  console.log("server started at", process.env.PORT)
});
