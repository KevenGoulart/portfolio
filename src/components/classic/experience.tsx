import { useTranslations } from 'next-intl'

export default function Experience() {
  const t = useTranslations('ExperienceClassic')
  return (
    <section
      id="experience"
      className="flex flex-col items-center gap-12 w-[400px] md:w-[1200px] mx-2 md:mx-auto mt-12 md:mt-28 mb-12"
    >
      <h2 className="text-3xl md:text-5xl text-yellow-200 self-start ml-8">
        {t('title')}{' '}
        <hr className="w-[350px] md:w-[670px] ml-7 border border-purple-700" />
      </h2>

      <div className="flex flex-col md:flex-row max-sm:gap-8">
        <div className="w-full">
          <h3 className="text-3xl mb-4">{t('workTitle')}</h3>
          <ul className="flex flex-col gap-4 tracking-wider text-lg">
            <li className="border-l-2 border-purple-400 pl-4">
              <p className="font-semibold tracking-widest">{t('job1')}</p>
              <p className="text-gray-300">Bttis – Governador Valadares</p>
              <p className="text-gray-400 text-sm">2025-04 – {t('current')}</p>
            </li>
            <li className="border-l-2 border-purple-400 pl-4">
              <p className="font-semibold tracking-widest">{t('job2')}</p>
              <p className="text-gray-300">
                X3 Contabilidade – Governador Valadares
              </p>
              <p className="text-gray-400 text-sm">2023-08 – 2025-04</p>
            </li>
            <li className="border-l-2 border-purple-400 pl-4">
              <p className="font-semibold tracking-widest">{t('job3')}</p>
              <p className="text-gray-300">
                Ols Tecnologia – Governador Valadares
              </p>
              <p className="text-gray-400 text-sm">2023-01 – 2023-03</p>
            </li>
          </ul>
        </div>

        <div className="w-full">
          <h3 className="text-3xl mb-4">{t('academicTitle')}</h3>
          <div className="border-l-2 border-purple-400 pl-4 tracking-wider text-lg">
            <p className="font-semibold tracking-widest">{t('degree')}</p>
            <p className="text-gray-300">
              Universidade Vale do Rio Doce Univale – Governador Valadares
            </p>
            <p className="text-gray-400 text-sm">2021-04 – 2024-11</p>
          </div>
        </div>
      </div>
    </section>
  )
}
