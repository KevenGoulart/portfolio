import { useTranslations } from 'next-intl'

export default function ClassicRedirect() {
  const t = useTranslations('ClassicRedirect')

  function handleClick() {
    window.location.href = '/classic'
  }

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 rounded-md border hover:bg-gray-100/30"
    >
      {t('linkText')}
    </button>
  )
}
