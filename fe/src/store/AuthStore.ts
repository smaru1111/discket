import { UserEntity } from '@/types/user'
import { StateCreator, create } from 'zustand'

export type StoreMe = UserEntity

interface AuthSlice {
  me: StoreMe | null | undefined
  setStoreMe: (user: StoreMe | null) => void
}

const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  me: undefined,
  setStoreMe: (user: StoreMe | null) => set({ me: user }),
})

export const useAuthStore = create<AuthSlice>(createAuthSlice)
