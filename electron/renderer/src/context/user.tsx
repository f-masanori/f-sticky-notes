import React from 'react'

export type UserInfo = {
  uid: string
  email: string
  token?: string
}

export type TUserContext = {
  userInfo: UserInfo
  setUserInfo: React.Dispatch<UserInfo>
}

export const UserContext = React.createContext<TUserContext>({
  userInfo: { uid: '', email: '' },
  setUserInfo: () => {},
})

type UserProviderProps = {
  children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    uid: '',
    email: '',
  })

  console.log('UserProvider')
  return <UserContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserContext.Provider>
}
