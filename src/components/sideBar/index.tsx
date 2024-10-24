import { authStore } from "@/store";
import {
  Book,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export default function SideBar() {
  const { user, removeUser } = authStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        className="fixed top-4 right-8 md:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-3 mb-8">
          <Book className="w-8 h-8" />
          <h1 className="text-xl font-bold uppercase">
            Estudos e Treinamentos
          </h1>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {[
              { icon: Home, label: "Início", href: "/dashboard" },
              { icon: FileText, label: "Cursos", href: "/cursos" },
              {
                icon: Settings,
                label: "Configurações",
                href: "/configuracoes",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-700 transition-colors ${
                    pathname === item.href ? "bg-blue-900" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex justify-center m-4 p-2 flex-col gap-2 items-center bg-blue-600  rounded-lg">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm font-bold">
              {user?.name.toUpperCase()}
            </span>
          </div>
          <Button
            onClick={() => {
              removeUser();
              router.push("/");
            }}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
        <div className="mt-auto text-sm text-blue-200 flex items-center justify-center">
          © 2024 Patrick Enderson
        </div>
      </div>
    </>
  );
}
