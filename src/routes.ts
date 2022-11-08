import express from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
} from "./api/controllers/user-controler";

const router = express.Router();

// User

router.get("/users", getAllUsers);

router.post("/users", createUser);

router.get("/users/:id", getUserById);

export { router };
