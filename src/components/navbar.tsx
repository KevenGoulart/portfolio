import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <>
      <div className="w-full h-16 bg-slate-950 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Image src="/logo.png" alt="logo" width={70} height={70} />
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/about">
                  <p>About Me</p>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <p>Projects</p>
                </Link>
              </li>
              <li>
                <Link href="/contacts">
                  <p>Contact</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
