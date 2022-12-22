import Link from 'next/link'

const IndexPage = () => {
  return (
    <p>
      <Link href='/login'>
        <a>Go To Login Page</a>
      </Link>
    </p>
  )
}

export default IndexPage
