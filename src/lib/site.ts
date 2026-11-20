export const SITE_URL = 'https://kezgoulart.dev'

export const CONTACT = {
  email: 'kevengoulartmm@gmail.com',
  phone: '+55 (33) 9 9806-2123',
  phoneHref: 'tel:+5533998062123',
  linkedin: 'https://www.linkedin.com/in/keven-goulart-890248215/',
  github: 'https://github.com/KevenGoulart'
}

// first job in the field (internship at Ols Tecnologia), used to show the
// years of experience without having to update the text every year
export const CAREER_START = new Date(2023, 0, 1)

export function yearsOfExperience(now = new Date()) {
  const months =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    now.getMonth() -
    CAREER_START.getMonth()
  return Math.max(1, Math.round(months / 12))
}
