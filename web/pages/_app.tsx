import { signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import { Loading } from '@/uiComponents/Loading'
import { Header } from '@/uiComponents/header'
import { UserContext, UserProvider } from 's@/context/user'
import { signInWithGoogle, auth } from 's@/services/firebase/auth'
import '@/styles/styles.css'

import 'tailwindcss/tailwind.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  console.log('MyApp')
  const router = useRouter()

  const clickLogout = async function () {
    signOut(auth)
      .then(() => {
        // setUserInfo({ uid: '', email: '' })
        router.push('/SNboard')
        location.reload()
        console.log('ログアウトしました')
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`)
      })
  }

  const Comp = () => {
    return (
      <>
        <Header clickLogout={clickLogout} clickLogin={() => router.push('/login')} />
        <div className='mt-14'>
          <Component {...pageProps} />
        </div>
      </>
    )
  }
  return (
    <UserProvider>
      {router.pathname === '/top' ? (
        <Comp />
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
  const setUserInfo = React.useContext(UserContext).setUserInfo
  const userInfo = React.useContext(UserContext).userInfo

  console.info('AuthWrapper')

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
          setUserInfo({ uid, email: email || '', token })
          router.push('/SNboard')
        }
      } else {
        if (userInfo.uid !== '') setUserInfo({ uid: '', email: '', token: '' })
        if (userInfo.uid === '') router.push('/login')
      }
      setIsAuthVerificationLoading(false)
    })
  }, [])

  if (isAuthVerificationLoading) {
    return <Loading></Loading>
  } else if (userInfo.uid === '') {
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
