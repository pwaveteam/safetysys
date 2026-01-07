import { create } from 'zustand'

interface CompanyState {
  factoryName: string
  setFactoryName: (name: string) => void
}

export const useCompanyStore = create<CompanyState>((set) => ({
  factoryName: "(주)경인EPS 오창공장",
  setFactoryName: (name) => set({ factoryName: name })
}))
