import { useEffect } from 'react'
import Link from 'next/link'
import Layout from 's@/components/Layout'

const IndexPage = () => {
  return (
    <p>
      <Link href='/login'>
        <a>To Login Page</a>
      </Link>
    </p>
  )
}

export default IndexPage
