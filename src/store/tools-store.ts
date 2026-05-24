"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RecentTool {
  slug: string;
  name: string;
  ts: number;
}

interface ToolsStore {
  /** Files dropped on the homepage spotlight, awaiting routing */
  queuedFiles: File[];
  setQueuedFiles: (files: File[]) => void;
  consumeQueuedFiles: () => File[];

  /** Recently used tools (persisted) */
  recent: RecentTool[];
  trackUse: (slug: string, name: string) => void;
  clearRecent: () => void;
}

export const useToolsStore = create<ToolsStore>()(
  persist(
    (set, get) => ({
      queuedFiles: [],
      setQueuedFiles: (files) => set({ queuedFiles: files }),
      consumeQueuedFiles: () => {
        const f = get().queuedFiles;
        set({ queuedFiles: [] });
        return f;
      },
      recent: [],
      trackUse: (slug, name) => {
        const recent = [
          { slug, name, ts: Date.now() },
          ...get().recent.filter((r) => r.slug !== slug),
        ].slice(0, 8);
        set({ recent });
      },
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: "golupdfs:tools-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ recent: s.recent }) as Pick<ToolsStore, "recent">,
    }
  )
);
