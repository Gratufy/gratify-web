import { create } from 'zustand';

interface FavoritesSearchState {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
}

export const useFavoritesSearchStore = create<FavoritesSearchState>((set) => ({
  search: '',
  setSearch: (value) => set({ search: value }),
  clearSearch: () => set({ search: '' }),
}));
