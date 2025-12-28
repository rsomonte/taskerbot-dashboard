"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full bg-[#2b2d31] border-b border-[#1e1f22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <Image
                src="/taskerlogo.png"
                alt="TaskerBot Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white">
                TaskerBot
              </span>
            </Link>
            {session && (
              <Link 
                href="/feed" 
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Feed
              </Link>
            )}
          </div>
          <div className="flex items-center">
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-[#313338] animate-pulse"></div>
            ) : session ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2 px-4 rounded transition-colors text-sm"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
