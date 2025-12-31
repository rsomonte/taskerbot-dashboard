"use client";

import { useState, useTransition, useEffect } from "react";
import { updateSetting } from "@/app/actions";
import { SettingDefinition } from "@/lib/db";

interface SettingsFormProps {
  definitions: SettingDefinition[];
  userSettings: Record<string, string>;
}

export default function SettingsForm({ definitions, userSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(userSettings);
  const [isPending, startTransition] = useTransition();

  // Sync state with props when they change (e.g. after server revalidation)
  useEffect(() => {
    setSettings(userSettings);
  }, [userSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    startTransition(async () => {
      await updateSetting(key, value);
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {definitions.map((def) => {
        const currentValue = settings[def.key] || def.defaultValue;
        const options = def.options ? JSON.parse(def.options) : [];

        return (
          <div key={def.key} className="bg-[#2b2d31] rounded-lg shadow-md p-6 border border-[#1e1f22]">
            <h2 className="text-xl font-semibold mb-4 text-white">{def.label}</h2>
            {def.description && (
              <p className="text-gray-400 mb-6 text-sm">{def.description}</p>
            )}

            {def.type === 'select' && (
              <div className="flex flex-col gap-3">
                {options.map((opt: any) => (
                  <label
                    key={opt.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      currentValue === opt.value
                        ? 'border-[#5865F2] bg-[#5865F2]/10'
                        : 'border-[#1e1f22] hover:bg-[#313338]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={def.key}
                      value={opt.value}
                      checked={currentValue === opt.value}
                      onChange={() => handleChange(def.key, opt.value)}
                      className="w-4 h-4 text-[#5865F2] bg-[#1e1f22] border-gray-600 focus:ring-[#5865F2]"
                      disabled={isPending}
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-white">{opt.label}</span>
                      {opt.description && (
                        <span className="block text-xs text-gray-400">{opt.description}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            {/* Add other types here if needed */}
          </div>
        );
      })}
      
      {isPending && (
        <p className="text-xs text-[#5865F2] mt-2 animate-pulse text-right">Saving changes...</p>
      )}
    </div>
  );
}
