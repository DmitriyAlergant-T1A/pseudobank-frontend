// src/store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  juicySessionId: null,
  setJuicySessionId: (id) => set({ juicySessionId: id }),
}));

export default useStore;