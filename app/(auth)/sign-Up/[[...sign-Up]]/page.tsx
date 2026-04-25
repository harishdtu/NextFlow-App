import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}