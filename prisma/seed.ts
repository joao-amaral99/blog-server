import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "joaoadmin@gmail.com",
      name: "João Amaral",
      password: "admin",

      posts: {
        create: {
          title: "Iniciando um projeto NodeJs , Express com Typescript",
          content:
            "Toda aplicação necessita de pacotes específicos conforme a necessidade do escopo do projeto",
        },
      },
    },
  });
}

main();
