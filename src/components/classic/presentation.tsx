import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Presentation() {
  return (
    <main id="presentation" className="flex items-center justify-evenly mt-20">
      <div className="max-w-[500px] flex flex-col gap-4">
        <h1 className="text-5xl text-yellow-400 text-center">
          Hi, I'm Keven Goulart <br /> FullStack Developer
        </h1>
        <p className="text-lg text-center">
          Hello! My name is Kéven Goulart Medeiros, and I work as a developer
          specializing in TypeScript, Node.js, React, Next.js, and Nest. I have
          experience in building full-stack applications, working on both
          front-end and back-end development, with a focus on scalable and
          well-structured solutions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center justify-center border border-white rounded-full p-2 hover:border-white/70 cursor-pointer">
            <Link
              href="https://www.linkedin.com/in/k%C3%A9ven-goulart-890248215/"
              target="_blank"
            >
              <FaLinkedin className="size-8 hover:text-white/70" />
            </Link>
          </div>
          <div className="flex items-center justify-center border border-white rounded-full p-2 hover:border-white/70 cursor-pointer">
            <Link href="https://github.com/KevenGoulart" target="_blank">
              <FaGithub className="size-8 hover:text-white/70" />
            </Link>
          </div>
        </div>
      </div>
      <div
        className="border-8 border-green-300 overflow-hidden inline-block"
        style={{
          clipPath:
            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        }}
      >
        <Image
          src="/magi.gif"
          alt="Magi"
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  )
}
