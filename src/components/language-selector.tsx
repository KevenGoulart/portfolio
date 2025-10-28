'use client'

export default function LanguageSelector() {
  const handleChange = async (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`

    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange('en')}
        className="px-3 py-1 rounded-md border hover:bg-gray-100/30"
      >
        🇺🇸 English
      </button>

      <button
        onClick={() => handleChange('pt-BR')}
        className="px-3 py-1 rounded-md border hover:bg-gray-100/30"
      >
        🇧🇷 Português
      </button>
    </div>
  )
}
