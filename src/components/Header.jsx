import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <header className="header">
      <nav>
        <div className="logo"><Link href="/">HALO</Link></div>
        <h1>My App</h1>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>

    </header>
  )
}

