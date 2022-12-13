import { signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import { Loading } from 's@/core/uiComponents/Loading'
import { Header } from 's@/core/uiComponents/header'
import { UserContext, UserProvider } from 's@/core/context/users'
import { signInWithGoogle, auth } from 's@/services/firebase/auth'
import '@/styles/styles.css'

import 'tailwindcss/tailwind.css'
console.log(process.env.NEXT_PUBLIC_APP_ENV)

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  const clickLogout = async function () {
    signOut(auth)
      .then(() => {
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
  console.log({ path })
  const router = useRouter()
  const setUserInfo = React.useContext(UserContext).setUserInfo
  const userInfo = React.useContext(UserContext).userInfo

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
          const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/loginHistory', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: {
              'Content-Type': 'application/json',
              uid: uid,
              token: token,
            },
          })
          console.log(res.json())
          setUserInfo({ uid, email: email || '', token })
          router.push(path)
        }
      } else {
        if (userInfo.uid !== '') setUserInfo({ uid: '', email: '', token: '' })
        router.push('/login')
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
