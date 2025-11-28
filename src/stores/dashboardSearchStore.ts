import { create } from 'zustand';

interface DashboardSearchState {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
}

export const useDashboardSearchStore = create<DashboardSearchState>((set) => ({
  search: '',
  setSearch: (value) => set({ search: value }),
  clearSearch: () => set({ search: '' }),
}));
