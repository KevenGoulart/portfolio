import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FadeDownSection } from '../fade-down'
import { useTranslations } from 'next-intl'

export default function NewContact() {
  const t = useTranslations('ContactClassic')

  return (
    <footer id="contact">
      <div className="relative h-[700px] bg-[url('/rei.gif')] bg-cover bg-center bg-no-repeat flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 to-transparent" />

        <FadeDownSection>
          <div className="relative flex flex-col items-center gap-8 mt-40">
            <h2 className="text-6xl tracking-widest text-white">
              {t('title')}
            </h2>
            <ul className="text-xl text-white flex flex-col items-center space-y-6">
              <li className="flex items-center gap-4">
                <FaEnvelope className="size-6" /> E-mail:
                kevengoulartmm@gmail.com
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
        </FadeDownSection>
      </div>
    </footer>
  )
}
