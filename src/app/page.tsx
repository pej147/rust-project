import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Ingelogd -> ga naar map
    redirect("/map");
  } else {
    // Niet ingelogd -> ga naar login
    redirect("/login");
  }
}
