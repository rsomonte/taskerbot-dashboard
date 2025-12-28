"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full border border-gray-600"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
            <span className="text-white text-sm">
              {session.user.name?.charAt(0) || "U"}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#2b2d31] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 border border-[#1e1f22]">
          <div className="px-4 py-2 border-b border-[#1e1f22]">
            <p className="text-sm font-medium text-white truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {session.user.email}
            </p>
          </div>
          
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#313338]"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          
          <a
            href="https://github.com/rsomonte/taskerbot"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#313338]"
            onClick={() => setIsOpen(false)}
          >
            Help
          </a>
          
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#313338]"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
