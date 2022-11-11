import express from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "./api/controllers/user-controler";

const router = express.Router();

// User

router.get("/users", getAllUsers);

router.post("/users", createUser);

router.get("/users/:id", getUserById);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

export { router };
