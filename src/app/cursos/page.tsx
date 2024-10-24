"use client";
import SideBar from "@/components/sideBar";

export default function Index() {
  return (
    <div>
      <SideBar />
      <div className="min-h-screen bg-gray-900 flex justify-center md:ml-64 md:block text-white">
        <div className="p-4">
          <h1 className="text-4xl font-bold">Cursos</h1>
        </div>
        <div className="p-4">
          <h1 className="text-4xl font-bold">Cursos</h1>
        </div>
      </div>
    </div>
  );
}
