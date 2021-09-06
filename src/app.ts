import express, { json } from "express";
import { StockService } from "./service";

const port = process.env.PORT || 3000;

const app = express();
app.use(json());
app.set("view engine", "ejs");

const service = new StockService();

app.get("/ping", (_req, res) => {
  res.send(JSON.stringify({ healthy: true }));
});

app.get("/stocks", (_req, res) => {
  res.send(JSON.stringify(service.list()));
});

app.post("/stocks", (req, res) => {
  const transactionId = service.create(req.body);
  res.send(JSON.stringify({ transactionId }));
});

app.get("/static", (req, res) => {
  res.render("static/index", {
    name: "World",
  })
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
