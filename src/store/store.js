// src/store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  juicySessionId: null,
  setJuicySessionId: (id) => set({ juicySessionId: id }),
  aloktaResponse: '',
  setAloktaResponse: (response) => set({ aloktaResponse: response }),
  requestPayload: '',
  setRequestPayload: (response) => set({ requestPayload: response }),
  config: {},
  setConfig: (config) => set({ config }),
}));

export default useStore;