import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FadeDownSection } from '../fade-down'
import { useTranslations } from 'next-intl'
import BlobComponent from '../Blob'

export default function Contact() {
  const t = useTranslations('Contact')

  return (
    <footer id="contact">
      <div className="relative h-[960px] w-full flex justify-center max-sm:hidden">
        <BlobComponent />

        <FadeDownSection>
          <div className="relative flex flex-col items-center gap-8 mt-40 ml-10">
            <h2
              className="text-7xl tracking-widest text-white"
              style={{ textShadow: '3px 3px 12px rgba(0, 0, 0, 0.7)' }}
            >
              {t('title')}
            </h2>
            <ul className="text-xl text-white flex flex-col items-center space-y-6">
              <li
                className="flex items-center gap-4"
                style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
              >
                <FaEnvelope className="size-6" /> E-mail:
                kevengoulartmm@gmail.com
              </li>
              <li
                className="flex items-center gap-4"
                style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
              >
                <FaPhoneAlt className="size-6" /> Phone: +55 (33) 9 9808-8464
              </li>
              <li
                className="flex items-center gap-4"
                style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
              >
                <SiLinkedin className="size-6" /> Linkedin: @kevengoulart
              </li>
              <li
                className="flex items-center gap-4"
                style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
              >
                <SiGithub className="size-6" /> Github: @KevenGoulart
              </li>
            </ul>
          </div>
        </FadeDownSection>
      </div>

      <div className="md:hidden">
        <div className="relative h-[700px] bg-[url('/rei.gif')] bg-cover bg-center bg-no-repeat flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 to-transparent" />

          <FadeDownSection yEnd={0}>
            <div className="relative flex flex-col items-center gap-8 mt-40 ml-8">
              <h2 className="text-5xl tracking-widest text-white">
                {t('title')}
              </h2>
              <ul className="text-xl text-white flex flex-col items-center space-y-6">
                <li className="flex items-center gap-2">
                  <FaEnvelope className="size-6" /> E-mail:
                  kevengoulartmm@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <FaPhoneAlt className="size-6" /> Phone: +55 (33) 9 9808-8464
                </li>
                <li className="flex items-center gap-2">
                  <SiLinkedin className="size-6" /> Linkedin: @kevengoulart
                </li>
                <li className="flex items-center gap-2">
                  <SiGithub className="size-6" /> Github: @KevenGoulart
                </li>
              </ul>
            </div>
          </FadeDownSection>
        </div>
      </div>
    </footer>
  )
}
