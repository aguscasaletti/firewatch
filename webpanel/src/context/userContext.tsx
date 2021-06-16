import React, { createContext, useCallback } from 'react'
import { UserInfo } from 'types/domain'

interface UserContextValue {
  userInfo: UserInfo
  logout: () => void
}

const mockedUserInfo = {
  id: 1,
  username: 'demo',
  applicationName: 'firewatch',
}

const UserContext = createContext<UserContextValue>({
  logout: () => undefined,
  userInfo: mockedUserInfo,
})
const { Provider } = UserContext

export const UserContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const logout = useCallback(() => {}, [])

  return (
    <Provider
      value={{
        userInfo: mockedUserInfo,
        logout,
      }}
    >
      {children}
    </Provider>
  )
}

export default UserContext
