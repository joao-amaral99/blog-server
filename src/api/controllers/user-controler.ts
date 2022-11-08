import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

async function createUser(req: express.Request, res: express.Response) {
  const createUserBody = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string(),
  });

  const { email, name, password } = createUserBody.parse(req.body);

  try {
    const userAlreadyExists = await prisma.user.findFirst({ where: { email } });

    if (!userAlreadyExists) {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      });

      return res.status(201).send({ user });
    }

    return res.status(400).json({ message: "Esse email já está em uso" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um problema ao criar o usuário" });
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();

    return res.status(200).send(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um problema ao buscar usuários" });
  }
}

async function getUserById(req: Request, res: Response) {
  const createUserBody = z.object({
    id: z.string(),
  });

  const { id } = createUserBody.parse(req.params);

  try {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return res
        .status(200)
        .json({ message: "Não existe usuário com esse id" });
    }

    return res.status(200).send({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um problema ao buscar um usuário" });
  }
}

export { createUser, getAllUsers, getUserById };
