import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

const prisma = new PrismaClient();

// Schema para validação de criação/atualização de usuário
const SchemaCreateUser = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

// Schema para atualização de usuário
const SchemaUpdateUser = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

// POST - Criar um novo usuário
const handler = async (req: Request) => {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const data = SchemaCreateUser.parse(body);

      // Verificar se o email já está cadastrado
      const checkExists = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (checkExists) {
        return NextResponse.json(
          { error: "Email já cadastrado" },
          { status: 409 } // Status 409 Conflict
        );
      }

      // Criptografar senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Criar novo usuário
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });

      return NextResponse.json({ data: newUser }, { status: 201 }); // Status 201 Created
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: error.errors
              .map(
                (errorMessage) =>
                  `${errorMessage.path[0]} ${errorMessage.message}`
              )
              .join(", "),
          },
          { status: 400 } // Status 400 Bad Request
        );
      }

      return NextResponse.json(
        { message: "Erro interno no servidor", error },
        { status: 500 } // Status 500 Internal Server Error
      );
    }
  }

  // GET - Buscar todos os usuários
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return NextResponse.json({ data: users }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Erro ao buscar usuários" },
        { status: 500 }
      );
    }
  }

  // DELETE - Deletar um usuário por ID
  if (req.method === "DELETE") {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    try {
      await prisma.user.delete({
        where: { id: userId },
      });

      return NextResponse.json(
        { message: `Usuário com ID ${userId} deletado com sucesso` },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Erro ao deletar usuário" },
        { status: 500 }
      );
    }
  }

  // PUT - Atualizar informações de um usuário
  if (req.method === "PUT") {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    try {
      const body = await req.json();
      const data = SchemaUpdateUser.parse(body);

      // Se for fornecida uma nova senha, criptografe-a
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      });

      return NextResponse.json(
        { data: updatedUser, message: "Usuário atualizado com sucesso" },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: error.errors
              .map(
                (errorMessage) =>
                  `${errorMessage.path[0]} ${errorMessage.message}`
              )
              .join(", "),
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Erro ao atualizar usuário" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: "Método não permitido" },
    { status: 405 }
  );
};

export { handler as DELETE, handler as GET, handler as POST, handler as PUT };
