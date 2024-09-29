import { UserEntity } from '@/types/user'
import { StateCreator, create } from 'zustand'

export type StoreUser = UserEntity
export type UpdateStoreUserInput = Pick<StoreUser, 'uid'> & Partial<StoreUser>
interface UserSlice {
  users: StoreUser[]
  getStoreUser: (uid: string) => StoreUser | undefined
  setStoreUsers: (user: StoreUser[]) => void
  addStoreUser: (user: StoreUser) => void
  updateStoreUser: (user: UpdateStoreUserInput) => void
  deleteStoreUser: (uid: string) => void
}

const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  users: [],
  getStoreUser: (uid) => get().users.find((user) => user.uid === uid),
  setStoreUsers: (users: StoreUser[]) =>
    set(() => {
      return { users }
    }),
  addStoreUser: (user: StoreUser) =>
    set((state) => {
      return state.users.find((u) => u.uid === user.uid)
        ? {
            users: state.users.map((u) => (u.uid === user.uid ? Object.assign({}, u, user) : u)),
          }
        : { users: [user, ...state.users] }
    }),
  updateStoreUser: (user: UpdateStoreUserInput) =>
    set((state) => ({
      users: state.users.map((u) => (u.uid === user.uid ? Object.assign({}, u, user) : u)),
    })),
  deleteStoreUser: (uid: string) =>
    set((state) => ({ users: state.users.filter((u) => u.uid !== uid) })),
})

export const useUsersStore = create<UserSlice>(createUserSlice)
