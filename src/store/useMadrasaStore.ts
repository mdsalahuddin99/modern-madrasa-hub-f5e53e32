import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MadrasaFilters {
  searchName: string;
  selectedCategory: string;
  selectedDivision: string;
  selectedDistrict: string;
  selectedThana: string;
}

interface MadrasaState {
  filters: MadrasaFilters;
  setFilter: (key: keyof MadrasaFilters, value: string) => void;
  resetFilters: () => void;
}

const initialFilters: MadrasaFilters = {
  searchName: "",
  selectedCategory: "সব",
  selectedDivision: "সব",
  selectedDistrict: "সব",
  selectedThana: "সব",
};

export const useMadrasaStore = create<MadrasaState>()(
  persist(
    (set) => ({
      filters: initialFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: "madrasa-filters",
    }
  )
);
