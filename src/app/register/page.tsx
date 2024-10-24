"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userRegisterSchema = z
  .object({
    username: z.string(),
    email: z
      .string({
        message: "Campo obrigatório!",
      })
      .email({
        message: "Email Inválido",
      }),
    password: z
      .string({
        message: "Campo obrigatório!",
      })
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    confirmPassword: z
      .string({
        message: "Campo obrigatório!",
      })
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof userRegisterSchema>;

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const handleSubmit = async (data: RegisterSchema) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          name: data.username,
        }),
      });

      const resp = await response.json();

      console.log(resp);

      if (!response.ok) {
        throw new Error(resp.error);
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você pode fazer login agora!",
        className: "bg-emerald-500 text-white border-none",
      });
      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao cadastrar usuário",
        description: (error as Error).message,
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="bg-gray-700 p-5 w-[400px] rounded-lg gap-2 flex flex-col"
          >
            <div className="">
              <h1 className="text-4xl font-bold text-center">Cadastro</h1>
              <p className="mt-2 text-sm text-center">
                Crie sua conta para começar
              </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Usuario</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                      <Input className="pl-10 bg-gray-800" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                      <Input className="pl-10 bg-gray-800" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                      <Input
                        className="pl-10 bg-gray-800"
                        type="password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Confirmar Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                      <Input
                        className="pl-10 bg-gray-800"
                        type="password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label className="ml-2 text-sm">
                        Eu aceito os{" "}
                        <Link
                          href="/terms"
                          className="font-bold hover:underline"
                        >
                          termos e condições
                        </Link>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              Já tem uma conta?{" "}
              <Link href="/" className="font-bold hover:underline">
                Faça login
              </Link>
            </div>
            <Button
              className="font-bold bg-emerald-500 hover:bg-emerald-600"
              type="submit"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Cadastrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
