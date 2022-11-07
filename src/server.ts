import express from "express";
import cors from "cors";

import { router } from "./routes";

const app = express();

app.use(router);

app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use(express.json());

app.listen(3000, () => {
  console.log(`Servidor rodando`);
});
