import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const _select = {
  id: true,
  email: true,
  name: true,
  password: false,
};

async function createUser(req: express.Request, res: express.Response) {
  const createUserBody = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
  });

  const { email, name, password } = createUserBody.parse(req.body);

  try {
    const userAlreadyExists = await prisma.user.findFirst({ where: { email } });

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    if (!userAlreadyExists) {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hash,
        },
        select: _select,
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
    const users = await prisma.user.findMany({
      select: _select,
    });

    return res.status(200).send(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um problema ao buscar usuários" });
  }
}

async function getUserById(req: Request, res: Response) {
  const getIdFromParams = z.object({
    id: z.string(),
  });

  const { id } = getIdFromParams.parse(req.params);

  try {
    const user = await prisma.user.findFirst({
      where: { id },
      select: _select,
    });

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

async function updateUser(req: Request, res: Response) {
  const idUser = z.object({
    id: z.string(),
  });

  const createUserBody = z.object({
    email: z.string().email("O email deve ser válido").optional(),
    name: z.string().optional(),
    password: z.string().optional(),
  });

  const { id } = idUser.parse(req.params);

  const { email, name, password } = createUserBody.parse(req.body);

  try {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return res
        .status(200)
        .json({ message: "Não existe usuário com esse id" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        password,
      },
      select: _select,
    });

    return res.status(200).send({ updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um problema ao atualizar o usuário" });
  }
}

async function deleteUser(req: Request, res: Response) {
  const getIdFromParams = z.object({
    id: z.string(),
  });

  const { id } = getIdFromParams.parse(req.params);

  try {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return res
        .status(200)
        .json({ message: "Não existe usuário com esse id" });
    }

    await prisma.user.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um problema para deletar o usuário" });
  }
}

export { createUser, getAllUsers, getUserById, deleteUser, updateUser };
