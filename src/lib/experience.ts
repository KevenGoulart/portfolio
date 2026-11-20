// work and education history shared by the journey and the /resume page;
// titles and descriptions live in messages/*.json under Experience

export interface Job {
  /** Experience.<key> is the title, Experience.<key>Description the summary */
  key: 'job1' | 'job2' | 'job3'
  company: string
  city: string
  start: string
  /** undefined while it is the current job */
  end?: string
}

export const JOBS: Job[] = [
  {
    key: 'job1',
    company: 'Bttis',
    city: 'Governador Valadares',
    start: '2025-04'
  },
  {
    key: 'job2',
    company: 'X3 Contabilidade',
    city: 'Governador Valadares',
    start: '2023-08',
    end: '2025-04'
  },
  {
    key: 'job3',
    company: 'Ols Tecnologia',
    city: 'Governador Valadares',
    start: '2023-01',
    end: '2023-03'
  }
]

export const EDUCATION = {
  institution: 'Universidade Vale do Rio Doce (Univale)',
  city: 'Governador Valadares',
  start: '2021-04',
  end: '2024-11'
}
