import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { SiGithub, SiLinkedin } from 'react-icons/si'

export default function Contact() {
  return (
    <footer id="contact">
      <div className="relative h-[700px] bg-[url('/rei.gif')] bg-cover bg-center bg-no-repeat flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent" />

        <div className="relative flex flex-col gap-8 mt-40">
          <h2 className="text-6xl tracking-widest text-white">Contact Me</h2>
          <ul className="text-xl text-white space-y-6 ml-4">
            <li className="flex items-center gap-4">
              <FaEnvelope className="size-6" /> E-mail: kevengoulartmm@gmail.com
            </li>
            <li className="flex items-center gap-4">
              <FaPhoneAlt className="size-6" /> Phone: +55 (33) 9 9808-8464
            </li>
            <li className="flex items-center gap-4">
              <SiLinkedin className="size-6" /> Linkedin: @kevengoulart
            </li>
            <li className="flex items-center gap-4">
              <SiGithub className="size-6" /> Github: @KevenGoulart
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
