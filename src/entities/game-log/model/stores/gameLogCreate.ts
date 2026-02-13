"use client";

import { create } from "zustand";

interface GameLogCreateStore {
  canAccessFinishPage: boolean;
  handleCanAccessFinishPage: (canAccess: boolean) => void;
  handleClearAccess: () => void;
}

export const useGameLogCreateStore = create<GameLogCreateStore>()((set) => ({
  canAccessFinishPage: false,
  handleCanAccessFinishPage: (canAccess) =>
    set({ canAccessFinishPage: canAccess }),
  handleClearAccess: () => set({ canAccessFinishPage: false }),
}));
