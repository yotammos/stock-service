import express, { json, Response } from "express";
import { StockService } from "./service";
import { check, ValidationError, validationResult } from "express-validator";
import { HttpError } from "./core";

const port = process.env.PORT || 3000;

const app = express();
app.use(json());
app.set("view engine", "ejs");

const service = new StockService();

function handleErrors(res: Response, err: any) {
  if (err.errors) {
    res.status(400).json(err);
  } else if (err.httpStatusCode) {
    const { httpStatusCode, message }: HttpError = err;
    console.log(JSON.stringify({ message }), err);
    res.status(httpStatusCode).json({ message });
  } else {
    console.log(JSON.stringify({ message: "internal error" }), err);
    res.status(500).json({ message: "internal error" });
  }
}

app.get("/ping", (_req, res) => {
  res.send(JSON.stringify({ healthy: true }));
});

app.get("/stocks", async (_req, res) => {
  try {
    res.send(JSON.stringify(await service.list()));
  } catch (err) {
    handleErrors(res, err);
  }
});

app.post(
  "/stocks",
  check("symbol").exists().isString(),
  check("value").exists().isNumeric(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const transactionId = await service.create(req.body);
      res.send(JSON.stringify({ transactionId }));
    } catch (err: any) {
      handleErrors(res, err);
    }
  },
);

app.get("/static", (_req, res) => {
  res.render("static/index", {
    name: "World",
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
