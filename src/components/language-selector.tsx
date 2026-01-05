'use client'

export default function LanguageSelector() {
  const handleChange = async (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`

    window.location.reload()
  }

  return (
    <div className="flex items-center gap-4 md:gap-2">
      <button
        onClick={() => handleChange('en')}
        className="rounded-md border hover:bg-gray-100/30 overflow-hidden"
      >
        <img src="/usa.png" alt="US Flag" className="w-6 h-6 rounded-md" />
      </button>

      <button
        onClick={() => handleChange('pt-BR')}
        className="rounded-md border hover:bg-gray-100/30"
      >
        <img src="/brasil.png" alt="US Flag" className="w-6 h-6 rounded-md" />
      </button>
    </div>
  )
}
