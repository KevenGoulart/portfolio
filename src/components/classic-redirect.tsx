import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function ClassicRedirect() {
  const t = useTranslations('ClassicRedirect')
  return (
    <button className="px-3 py-1 rounded-md border hover:bg-gray-100/30">
      <Link href="/classic">{t('linkText')}</Link>
    </button>
  )
}
