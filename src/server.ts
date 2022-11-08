import express from "express";
import cors from "cors";

import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(cors);

app.listen(3333, () => {
  console.log(`Servidor rodando`);
});
