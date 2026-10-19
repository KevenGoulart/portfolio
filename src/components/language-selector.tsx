'use client'

const LOCALES = [
  { locale: 'en', flag: '/usa.png', label: 'English' },
  { locale: 'pt-BR', flag: '/brasil.png', label: 'Português' }
]

export default function LanguageSelector() {
  const handleChange = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`

    window.location.reload()
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ locale, flag, label }) => (
        <button
          key={locale}
          type="button"
          onClick={() => handleChange(locale)}
          className="pixel-button !px-2 !py-1.5"
          data-variant="paper"
          aria-label={label}
          title={label}
        >
          <img
            src={flag}
            alt=""
            className="h-4 w-6 [image-rendering:pixelated]"
          />
        </button>
      ))}
    </div>
  )
}
