"use client";

import { useEffect, useState } from "react";
import { getSubmissions } from "@/lib/storage";

interface Submission {
  id: string;
  objectiveName: string;
  timestamp: number;
  image: string;
}

export default function FeedPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const stored = await getSubmissions();
        // Filter out submissions without images as per requirement
        const validSubmissions = stored.filter((s) => s.image);
        // Sort by timestamp descending
        validSubmissions.sort((a, b) => b.timestamp - a.timestamp);
        setSubmissions(validSubmissions);
      } catch (e) {
        console.error("Failed to load submissions", e);
      }
    };
    loadSubmissions();
  }, []);

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] bg-[#313338]">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">My Activity Feed</h1>
        
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-[#2b2d31] rounded-lg border border-[#1e1f22]">
            <p>No local submissions found.</p>
            <p className="text-sm mt-2">Submit an objective with an image to see it here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-[#2b2d31] rounded-xl border border-[#1e1f22] overflow-hidden shadow-lg">
                <div className="p-4 border-b border-[#1e1f22] flex justify-between items-center bg-[#2b2d31]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                      ✓
                    </div>
                    <h2 className="font-semibold text-white">{sub.objectiveName}</h2>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(sub.timestamp).toLocaleDateString()} • {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="w-full bg-black flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={sub.image} 
                    alt={`Proof for ${sub.objectiveName}`}
                    className="max-h-[500px] w-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

