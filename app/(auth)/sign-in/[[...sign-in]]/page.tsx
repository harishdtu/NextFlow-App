import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Welcome to NextFlow 🚀
    </div>
  );
}