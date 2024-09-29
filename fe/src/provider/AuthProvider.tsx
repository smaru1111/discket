'use client'
// import SkeletonDisplay from '@/components/mainLayout/SkeletonDisplay'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/AuthStore'
import { InteractionStatus } from '@azure/msal-browser'
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from '@azure/msal-react'
import { ReactNode, useEffect } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const context = useMsal()
  const me = useAuthStore((state) => state.me)
  const { checkCurrentUser, login } = useAuth()
  console.log('context', context.inProgress)
  console.log('isAuthenticated', isAuthenticated)

  useEffect(() => {
    if (context.inProgress === InteractionStatus.None && isAuthenticated === true) {
      checkCurrentUser()
    } else if (context.inProgress === InteractionStatus.None && !me && isAuthenticated === false) {
      login()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.inProgress])

  return (
    <>
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        {/* <SkeletonDisplay /> */}
        <>loading...</>
      </UnauthenticatedTemplate>
    </>
  )
}
