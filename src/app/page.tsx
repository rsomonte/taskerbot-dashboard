import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getObjectives } from "@/lib/db";
import LoginButton from "@/components/LoginButton";
import ObjectivesTable from "@/components/ObjectivesTable";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">TaskerBot Dashboard</h1>
        <LoginButton />
      </main>
    );
  }

  const objectives = await getObjectives(session.user.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome back, {session.user.name}!</h1>
      <h2 className="mb-4 text-lg">Here are your objectives:</h2>
      <ObjectivesTable objectives={objectives} />
    </main>
  );
}
