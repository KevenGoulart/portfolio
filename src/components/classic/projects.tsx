import Image from 'next/image'

export default function Projects() {
  return (
    <section
      id="projects"
      className="flex flex-col gap-8 items-start mx-80 mt-28"
    >
      <h2 className="text-4xl text-yellow-400">Projects</h2>
      <div className="flex">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <Image
              src="/geeklog.png"
              alt="Geeklog"
              width={400}
              height={300}
              className="rounded-2xl border border-green-300/40"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl">GeekLog</h3>
              <p className="text-2xl">
                A social network for reviewing and sharing different types of
                media.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Image
              src="/github.png"
              alt="GitHub"
              width={400}
              height={300}
              className="rounded-2xl border border-green-300/40"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl">Other Projects</h3>
              <p className="text-2xl">
                You can check out my other projects on my GitHub profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
