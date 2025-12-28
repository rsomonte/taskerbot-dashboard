"use client"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-2xl font-semibold text-white">Welcome back, {session.user?.name}!</p>
        <Link 
          href="/settings"
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Go to Settings
        </Link>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg text-gray-300">Manage your TaskerBot configuration easily.</p>
      <button 
        onClick={() => signIn("discord")} 
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg"
      >
        Sign in with Discord
      </button>
    </div>
  )
}
