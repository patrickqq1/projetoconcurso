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
import { authStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
const userLoginSchema = z.object({
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
    .min(8)
    .max(20),
  rememberMe: z.boolean(),
});

type LoginSchema = z.infer<typeof userLoginSchema>;

export default function Home() {
  const { setUser } = authStore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      rememberMe: localStorage.getItem("rememberMe")
        ? JSON.parse(localStorage.getItem("rememberMe") as string).rememberMe
        : false,
      email: localStorage.getItem("rememberMe")
        ? JSON.parse(localStorage.getItem("rememberMe") as string).email
        : "",
    },
  });

  const handleSubmit = async (data: LoginSchema) => {
    if (data.rememberMe) {
      localStorage.setItem(
        "rememberMe",
        JSON.stringify({ email: data.email, rememberMe: data.rememberMe })
      );
    } else {
      localStorage.removeItem("rememberMe");
    }
    try {
      const response = await fetch("/api/users/auth", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const resp = await response.json();

      if (!response.ok) {
        throw new Error(resp.message);
      }

      const token = resp.token;
      console.log({ token });
      const user = jwtDecode(token) as {
        id: number;
        name: string;
        email: string;
      };
      setUser(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token
      );
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao fazer login",
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
              <h1 className="text-4xl font-bold text-center">Login</h1>
              <p className="mt-2 text-sm text-center">
                Entre com seu email e senha
              </p>
            </div>
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
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label className="ml-2">Lembrar-me</label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              Não tem uma conta então{" "}
              <Link href="/register" className="font-bold hover:underline">
                Cadastre-se
              </Link>
            </div>
            <Button
              className="font-bold bg-emerald-500 hover:bg-emerald-600"
              type="submit"
            >
              <LogIn className="w-5 h-5" />
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
