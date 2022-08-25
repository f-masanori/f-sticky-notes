import { useEffect } from 'react'
import Link from 'next/link'
import Layout from '../src/components/Layout'

const IndexPage = () => {
  return (
    <p>
      <Link href='/login'>
        <a>login</a>
      </Link>
    </p>
  )
}

export default IndexPage
