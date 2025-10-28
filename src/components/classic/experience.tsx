export default function Experience() {
  return (
    <section id="experience" className="flex flex-col gap-12 mx-80 mt-28 mb-12">
      <h2 className="text-4xl text-yellow-400">Work experience and Studies</h2>

      <div className="flex">
        <div className="w-full">
          <h3 className="text-2xl font-semibold mb-4">Work Experience:</h3>
          <ul className="flex flex-col gap-4">
            <li className="border-l-2 border-yellow-400 pl-4">
              <p className="font-bold">FullStack Developer</p>
              <p className="text-gray-300">Bttis – Governador Valadares</p>
              <p className="text-gray-400 text-sm">2025-04 – current</p>
            </li>
            <li className="border-l-2 border-yellow-400 pl-4">
              <p className="font-bold">Systems Analyst</p>
              <p className="text-gray-300">
                X3 Contabilidade – Governador Valadares
              </p>
              <p className="text-gray-400 text-sm">2023-08 – 2025-04</p>
            </li>
            <li className="border-l-2 border-yellow-400 pl-4">
              <p className="font-bold">Intern Developer</p>
              <p className="text-gray-300">
                Ols Tecnologia – Governador Valadares
              </p>
              <p className="text-gray-400 text-sm">2023-01 – 2023-03</p>
            </li>
          </ul>
        </div>

        <div className="w-full mt-8">
          <h3 className="text-2xl font-semibold mb-2">Academic history:</h3>
          <div className="border-l-2 border-yellow-400 pl-4">
            <p className="font-bold">
              Bachelor's degree in Information Systems
            </p>
            <p className="text-gray-300">
              Universidade Vale do Rio Doce Univale – Governador Valadares
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
