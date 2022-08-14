import { useEffect } from 'react'
import Link from 'next/link'
import Layout from '../src/components/Layout'

const IndexPage = () => {
  return (
    <Layout title='Home | Next.js + TypeScript + Electron Example'>
      <h1>Hello Next.js 👋</h1>
      <button>Say hi to electron</button>
      <p>
        <Link href='/login'>
          <a>login</a>
        </Link>
      </p>
    </Layout>
  )
}

export default IndexPage
