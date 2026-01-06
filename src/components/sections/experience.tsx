import { useTranslations } from 'next-intl'

export default function Experience() {
  const t = useTranslations('Experience')
  return (
    <div
      id="experience"
      className="flex items-center justify-center mt-20 md:mt-32"
    >
      <div className="flex flex-col items-center gap-12 w-[400px] md:w-[1200px] mx-2 md:mx-auto mt-12 md:mt-6">
        <h2 className="text-5xl font-bold md:text-7xl text-slate-900/85 self-start tracking-wider md:ml-8">
          {t('title')}
        </h2>

        <div className="flex flex-col md:flex-row max-sm:gap-8">
          <div className="w-full">
            <h3 className="text-5xl mb-4">{t('workTitle')}</h3>
            <ul className="flex flex-col gap-4 tracking-wider text-xl">
              <li className="border-l-8 border-purple-500 pl-4">
                <p className="font-medium tracking-widest text-2xl">
                  {t('job1')}
                </p>
                <p className="text-slate-900">Bttis – Governador Valadares</p>
                <p className="text-slate-800 text-sm">
                  2025-04 – {t('current')}
                </p>
              </li>
              <li className="border-l-8 border-purple-500 pl-4">
                <p className="font-medium tracking-widest text-2xl">
                  {t('job2')}
                </p>
                <p className="text-slate-900">
                  X3 Contabilidade – Governador Valadares
                </p>
                <p className="text-slate-800 text-sm">2023-08 – 2025-04</p>
              </li>
              <li className="border-l-8 border-purple-500 pl-4">
                <p className="font-medium tracking-widest text-2xl">
                  {t('job3')}
                </p>
                <p className="text-slate-900">
                  Ols Tecnologia – Governador Valadares
                </p>
                <p className="text-slate-800 text-sm">2023-01 – 2023-03</p>
              </li>
            </ul>
          </div>

          <div className="w-full">
            <h3 className="text-5xl mb-4">{t('academicTitle')}</h3>
            <div className="border-l-8 border-purple-500 pl-4 tracking-wider text-xl">
              <p className="font-medium tracking-widest text-2xl">
                {t('degree')}
              </p>
              <p className="text-slate-900">
                Universidade Vale do Rio Doce Univale – Governador Valadares
              </p>
              <p className="text-slate-800 text-sm">2021-04 – 2024-11</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
