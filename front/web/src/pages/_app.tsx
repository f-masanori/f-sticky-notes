import { signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import { Loading } from 's@/core/uiComponents/Loading'
import { Header } from 's@/core/uiComponents/header'
import { UserContext, UserProvider, UserInfo } from 's@/core/context/users'
import { auth } from 's@/services/firebase/auth'
import '@/styles/styles.css'
import { backendApi } from 's@/repository/common'
import 'tailwindcss/tailwind.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const [userInfo, setUserInfo] = React.useState<UserInfo>({ uid: '', email: '', token: '' })
  const [isAuthVerificationLoading, setIsAuthVerificationLoading] = React.useState(true)

  React.useEffect(() => {
    onAuthStateChanged(auth, async (user: User | null) => {
      // Note: User型をimportできなかったためany
      console.log('onAuthStateChanged')
      if (user) {
        const token = await user.getIdToken()
        const uid = user.uid
        const email = user.email
        if (userInfo.uid !== uid) {
          // TODO: エラーハンドリング
          const res = await backendApi(uid, token).POST('/loginHistory')
          setUserInfo({ uid, email: email || '', token })
        }
      } else {
        setUserInfo({ uid: '', email: '', token: '' })
        router.push('/login')
      }
      setIsAuthVerificationLoading(false)
    })
  }, [])

  const clickLogout = async () => {
    signOut(auth)
      .then(() => {
        router.push('/SNboard')
        location.reload()
        console.log('Logged out successfully')
      })
      .catch((error) => {
        console.log(`An error occurred  (${error})`)
      })
  }

  const clickLogin = () => {
    router.push('/login')
  }

  const Comp = () => {
    return (
      <>
        <Header clickLogout={clickLogout} clickLogin={clickLogin} />
        <div className='mt-14'>
          <Component {...pageProps} />
        </div>
      </>
    )
  }

  return (
    <UserProvider uid={userInfo.uid} email={userInfo.email}>
      {router.pathname === '/top' ? (
        <Comp />
      ) : isAuthVerificationLoading ? (
        <Loading></Loading>
      ) : (
        <AuthStateWrapper path={router.pathname}>
          <Comp />
        </AuthStateWrapper>
      )}
    </UserProvider>
  )
}

export default MyApp

type AuthStateWrapperProps = { children: React.ReactNode; path: string }

const AuthStateWrapper: React.FC<AuthStateWrapperProps> = ({ children, path }) => {
  const router = useRouter()
  const userInfo = React.useContext(UserContext).userInfo

  if (userInfo.uid === '') {
    if (router.pathname === '/login') return <>{children}</>
    return <Loading></Loading>
  } else {
    if (router.pathname === '/login') {
      router.push('/SNboard')
      return <Loading></Loading>
    }
    return <>{children}</>
  }
}
