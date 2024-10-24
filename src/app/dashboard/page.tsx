"use client";

import SideBar from "@/components/sideBar";

export default function Dashboard() {
  return (
    <div>
      <SideBar />
      <div className="flex min-h-screen justify-center md:block bg-gray-900 text-white md:ml-64">
        <div className="p-4">
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
