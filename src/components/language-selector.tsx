'use client'

export default function LanguageSelector() {
  const handleChange = async (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`

    window.location.reload()
  }

  return (
    <div className="flex items-center gap-6 md:gap-2">
      <button
        onClick={() => handleChange('en')}
        className="px-1 rounded-md border hover:bg-gray-100/30"
      >
        🇺🇸
      </button>

      <button
        onClick={() => handleChange('pt-BR')}
        className="px-1 rounded-md border hover:bg-gray-100/30"
      >
        🇧🇷
      </button>
    </div>
  )
}
