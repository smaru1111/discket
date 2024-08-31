import { fetchApiWithEnv } from "./useFetchApiWithEnv"

export default function UserRepository() {
  const fetchUsers = async () => {
    return fetchApiWithEnv(`/api/users`)
  }

  const fetchUser = async (uid: string) => {
    return fetchApiWithEnv(`/api/users?id=${uid}`)
  }

  const createUser = async (data: any) => {
    return fetchApiWithEnv('/api/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const updateUser = async (data: any) => {
    return fetchApiWithEnv(`/api/users?id=${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  const deleteUser = async (id: number) => {
    return fetchApiWithEnv(`/api/users?id=${id}`, {
      method: 'DELETE',
    })
  }

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
}
