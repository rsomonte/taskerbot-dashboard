"use client";

import { useState, useTransition } from "react";
import { Objective } from "@/lib/types";
import { getNextAllowedTime } from "@/lib/utils";
import { createNewObjective, deleteObjectives, renameUserObjective, submitUserObjective } from "@/app/actions";
import { saveSubmission } from "@/lib/storage";

interface ObjectivesTableProps {
  objectives: Objective[];
}

export default function ObjectivesTable({ objectives }: ObjectivesTableProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newObjectiveName, setNewObjectiveName] = useState("");
  const [newObjectiveFreq, setNewObjectiveFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [renameValue, setRenameValue] = useState("");
  const [submitFile, setSubmitFile] = useState<File | null>(null);

  const now = Date.now();

  const toggleSelect = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((n) => n !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === objectives.length) {
      setSelected([]);
    } else {
      setSelected(objectives.map((o) => o.name));
    }
  };

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete ${selected.length} objectives?`)) return;
    startTransition(async () => {
      await deleteObjectives(selected);
      setSelected([]);
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createNewObjective(newObjectiveName, newObjectiveFreq);
        setIsCreateModalOpen(false);
        setNewObjectiveName("");
        setNewObjectiveFreq("daily");
      } catch (error) {
        alert("Failed to create objective: " + error);
      }
    });
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length !== 1) return;
    startTransition(async () => {
      try {
        await renameUserObjective(selected[0], renameValue);
        setIsRenameModalOpen(false);
        setSelected([]);
        setRenameValue("");
      } catch (error) {
        alert("Failed to rename: " + error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length !== 1) return;
    
    startTransition(async () => {
      try {
        await submitUserObjective(selected[0]);

        // Save to IndexedDB for the Feed page
        if (submitFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result as string;
            const newSubmission = {
              id: crypto.randomUUID(),
              objectiveName: selected[0],
              timestamp: Date.now(),
              image: base64String
            };
            
            try {
              await saveSubmission(newSubmission);
            } catch (err) {
              console.error("Failed to save submission to storage", err);
            }
          };
          reader.readAsDataURL(submitFile);
        }

        setIsSubmitModalOpen(false);
        setSelected([]);
        setSubmitFile(null);
        alert("Objective submitted successfully!");
      } catch (error) {
        alert("Failed to submit: " + error);
      }
    });
  };

  const openRenameModal = () => {
    if (selected.length === 1) {
      setRenameValue(selected[0]);
      setIsRenameModalOpen(true);
    }
  };

  const openSubmitModal = () => {
    if (selected.length === 1) {
      setIsSubmitModalOpen(true);
    }
  };

  return (
    <div className="w-full max-w-6xl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#2b2d31] rounded-lg border border-[#1e1f22]">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Create Objective
        </button>
        
        <div className="h-8 w-px bg-[#3f4147] mx-2 hidden sm:block"></div>

        <button
          disabled={selected.length !== 1}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selected.length === 1
              ? "bg-[#313338] text-white hover:bg-[#404249] shadow-sm"
              : "bg-transparent text-gray-500 cursor-not-allowed"
          }`}
          onClick={openSubmitModal}
        >
          Submit
        </button>

        <button
          disabled={selected.length !== 1}
          onClick={openRenameModal}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selected.length === 1
              ? "bg-[#313338] text-white hover:bg-[#404249] shadow-sm"
              : "bg-transparent text-gray-500 cursor-not-allowed"
          }`}
        >
          Rename
        </button>

        <button
          disabled={selected.length === 0}
          onClick={handleDelete}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selected.length > 0
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
              : "bg-transparent text-gray-500 cursor-not-allowed"
          }`}
        >
          Delete {selected.length > 0 && `(${selected.length})`}
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#2b2d31] rounded-lg shadow overflow-hidden border border-[#1e1f22]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1e1f22] text-gray-400 uppercase font-medium border-b border-[#1e1f22]">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={objectives.length > 0 && selected.length === objectives.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-600 bg-[#313338] text-[#5865F2] focus:ring-[#5865F2]"
                  />
                </th>
                <th className="px-6 py-4">Objective Name</th>
                <th className="px-6 py-4">Frequency</th>
                <th className="px-6 py-4">Streak</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1f22]">
              {objectives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No objectives found. Create one to get started!
                  </td>
                </tr>
              ) : (
                objectives.map((obj) => {
                  const nextAllowed = getNextAllowedTime(obj);
                  const isAvailable = !obj.lastSubmitted || now >= nextAllowed;
                  const nextDate = new Date(nextAllowed);
                  const isSelected = selected.includes(obj.name);

                  return (
                    <tr
                      key={obj.name}
                      onClick={() => toggleSelect(obj.name)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#5865F2]/20"
                          : "hover:bg-[#313338]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(obj.name)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-600 bg-[#313338] text-[#5865F2] focus:ring-[#5865F2]"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {obj.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          obj.frequency === 'daily' ? 'bg-blue-900/50 text-blue-200' :
                          obj.frequency === 'weekly' ? 'bg-purple-900/50 text-purple-200' :
                          'bg-green-900/50 text-green-200'
                        }`}>
                          {obj.frequency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold flex items-center gap-1 text-gray-300">
                          {obj.streak} {obj.streak > 3 && '🔥'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isAvailable ? (
                          <span className="text-green-400 font-medium">Available Now</span>
                        ) : (
                          <span className="text-orange-400 text-xs">
                            Next: {nextDate.toLocaleDateString()} {nextDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#313338] rounded-lg shadow-xl max-w-md w-full p-6 border border-[#1e1f22]">
            <h3 className="text-lg font-bold mb-4 text-white">Create New Objective</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newObjectiveName}
                  onChange={(e) => setNewObjectiveName(e.target.value)}
                  className="w-full rounded-md border border-[#1e1f22] bg-[#1e1f22] px-3 py-2 text-white focus:ring-2 focus:ring-[#5865F2] outline-none"
                  placeholder="e.g., Drink Water"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Frequency</label>
                <select
                  value={newObjectiveFreq}
                  onChange={(e) => setNewObjectiveFreq(e.target.value as any)}
                  className="w-full rounded-md border border-[#1e1f22] bg-[#1e1f22] px-3 py-2 text-white focus:ring-2 focus:ring-[#5865F2] outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-[#404249] rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#313338] rounded-lg shadow-xl max-w-md w-full p-6 border border-[#1e1f22]">
            <h3 className="text-lg font-bold mb-4 text-white">Rename Objective</h3>
            <form onSubmit={handleRename}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">New Name</label>
                <input
                  type="text"
                  required
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full rounded-md border border-[#1e1f22] bg-[#1e1f22] px-3 py-2 text-white focus:ring-2 focus:ring-[#5865F2] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-[#404249] rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] disabled:opacity-50"
                >
                  {isPending ? "Renaming..." : "Rename"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#313338] rounded-lg shadow-xl max-w-md w-full p-6 border border-[#1e1f22]">
            <h3 className="text-lg font-bold mb-4 text-white">Submit Objective</h3>
            <p className="text-sm text-gray-400 mb-4">
              Upload proof for <strong>{selected[0]}</strong>.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Proof Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSubmitFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#5865F2]/10 file:text-[#5865F2]
                    hover:file:bg-[#5865F2]/20"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * Note: Image upload is stored locally in your browser.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-[#404249] rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] disabled:opacity-50"
                >
                  {isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
