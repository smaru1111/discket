import { redirectUri, signInRequest, signUpRequest } from '@/hooks/authAzure'
import { useAuthStore } from '@/store/AuthStore'
import { AccountInfo } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { useCallback } from 'react'
import { fetchApiWithEnv } from '../hooks/useFetchApiWithEnv'

export const useAuth = () => {
  const setStoreMe = useAuthStore((state) => state.setStoreMe)
  const { accounts, instance } = useMsal()
  const context = useMsal()

  const fetchB2CUser = async (uid: string) => {
    try {
      const res = await fetchApiWithEnv(`/api/adB2CUser?uid=${uid}`, {
        method: 'GET',
      })

      return res
    } catch (error) {
      console.error(error)
      throw new Error('Error acquiring access token')
    }
  }

  const getAccount = async () => {
    try {
      const account = accounts[0] as AccountInfo
      if (
        account &&
        account.idTokenClaims &&
        account.idTokenClaims.oid &&
        account.idTokenClaims.name
      ) {
        const user = await fetchB2CUser(account.idTokenClaims.oid)
        const jobTitle = user.jobTitle

        const activeUser = {
          uid: account.idTokenClaims.oid,
          name: account.idTokenClaims.name,
        }
        return activeUser
      } else {
        return null
      }
    } catch (error) {
      console.error('useAuth: getAccount error', error)
      return null
    }
  }

  const checkCurrentUser = useCallback(async () => {
    const account = await getAccount()
    if (account) {
      setStoreMe(account)
    } else if (context.inProgress === 'none') {
      try {
        await instance
          .acquireTokenSilent({
            ...signInRequest,
            account: accounts[0],
          })
          .then((response) => {
            console.log('response', response)
            instance.setActiveAccount(response.account)
          })
          .catch((error) => {
            console.error('useAADB2CAuth: checkCurrentUser error', error)
          })

        // time sleep
        // await new Promise((resolve) => setTimeout(resolve, 10000))

        const refreshedAccount = await getAccount()
        if (refreshedAccount) {
          setStoreMe(refreshedAccount)
        } else {
          instance.logout()
        }
      } catch (error) {
        instance.logout()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStoreMe, getAccount, instance, context.inProgress])

  const signUp = useCallback(async () => {
    try {
      await instance.loginRedirect(signUpRequest)
    } catch (error) {
      console.error('useAADB2CAuth: signUpAzure error', error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, checkCurrentUser])

  const login = useCallback(async () => {
    try {
      await instance.loginRedirect(signInRequest)
    } catch (error) {
      console.error('useAADB2CAuth: loginAzure error', error)
    }
  }, [instance])

  const logout = useCallback(async () => {
    try {
      const currentAccount = instance.getAccountByHomeId(accounts[0].homeAccountId)
      await instance.logoutRedirect({
        account: currentAccount,
        postLogoutRedirectUri: redirectUri,
      })

      setStoreMe(null)
    } catch (error) {
      console.error('useAADB2CAuth: logoutAzure error', error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, setStoreMe])

  return { login, logout, signUp, checkCurrentUser }
}
