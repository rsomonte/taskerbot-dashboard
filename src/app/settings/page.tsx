import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getSettingDefinitions, getUserSettings } from "@/lib/settingsDb";
import SettingsForm from "@/components/SettingsForm";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const definitions = getSettingDefinitions();
  const userSettings = getUserSettings(session.user.id);

  return (
    <div className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-8 text-white">Bot Settings</h1>
      <SettingsForm definitions={definitions} userSettings={userSettings} />
    </div>
  );
}
