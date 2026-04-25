import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Welcome to NextFlow 🚀
    </div>
  );
}