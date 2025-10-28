import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-purple-800 p-5 flex justify-between items-center px-20">
      <h1 className="text-white text-2xl">
        Keven Goulart / FullStack Developer
      </h1>
      <div className="flex items-center text-2xl gap-6">
        <Link
          href="#presentation"
          className="hover:text-purple-400 hover:scale-105"
        >
          About Me
        </Link>
        <Link
          href="#projects"
          className="hover:text-purple-400 hover:scale-105"
        >
          Projects
        </Link>
        <Link
          href="#experience"
          className="hover:text-purple-400 hover:scale-105"
        >
          Experience
        </Link>
      </div>
    </header>
  )
}
