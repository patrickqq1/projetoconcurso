"use client";

import { authStore } from "@/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Aguarda 1 segundo

      const { user: currentUser, token: currentToken } = authStore.getState();

      if (!currentUser && !currentToken && pathname === "/") {
        router.push("/");
      }
      if (!currentUser && !currentToken && pathname !== "/register") {
        router.push("/");
      }
      if (currentUser && currentToken && pathname === "/") {
        router.push("/dashboard");
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}
