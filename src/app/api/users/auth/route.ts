import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

const SchemaAuth = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const handler = async (req: Request) => {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const data = SchemaAuth.parse(body);

      const user = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      const passwordMatch = await compare(data.password, user.password);

      if (!passwordMatch) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        (process.env.JWT_SECRET as string) || "dsasddsasad",
        {
          expiresIn: "1h",
        }
      );

      return Response.json(
        { message: "Login successful", token },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json({ message: "Invalid data" }, { status: 400 });
      }
      return Response.json({ message: "Error" }, { status: 500 });
    }
  }
  return Response.json({ message: "Method not allowed" }, { status: 405 });
};

export { handler as DELETE, handler as GET, handler as POST, handler as PUT };
