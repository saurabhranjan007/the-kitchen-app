import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
  <>
  {/* creating uni navbar */}
    <nav className='header'>
      <div>
        <Link href="/"> 
          <a> The Kitchen 🥞 </a>
        </Link>
      </div>
    </nav>

    <main>
      <Component {...pageProps} />
    </main>

  </>
  )
}

export default MyApp
