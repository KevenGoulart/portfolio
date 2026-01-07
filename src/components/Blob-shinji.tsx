import { useSpring, animated } from 'react-spring'
import blobshape from 'blobshape'
import { CSSProperties, useState } from 'react'

type BlobProps = {
  color?: string
  image?: boolean
  style?: CSSProperties
}

export default function BlobComponentShinji(): JSX.Element {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* <BlobShinji
        color="#000000"
        style={{ opacity: 0.2, position: 'absolute', top: 0, left: 0 }}
      />
      <BlobShinji
        color="#000000"
        style={{ opacity: 0.4, position: 'absolute', top: 0, left: 0 }}
      /> */}
      <BlobShinji
        color="#000000"
        style={{ opacity: 0.5, position: 'absolute', top: 0, left: 0 }}
      />
      <BlobShinji
        image
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.95
        }}
      />
    </div>
  )
}

function getRandomPathShinji(): string {
  return blobshape({
    growth: 20,
    edges: 40
  }).path
}

function BlobShinji({ color, image, style }: BlobProps): JSX.Element {
  const [flip, setFlip] = useState(false)
  const [clipId] = useState(
    () => `blob-clip-shinji-${Math.random().toString(36).slice(2)}`
  )

  const { path } = useSpring<{ path: string }>({
    to: { path: getRandomPathShinji() },
    from: { path: getRandomPathShinji() },
    reverse: flip,
    config: { duration: image ? 9000 : 6000 },
    onRest: () => setFlip((prev) => !prev)
  })

  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: '100%', height: '100%', ...style }}
    >
      {!image && <animated.path fill={color} d={path} />}
      {image && (
        <>
          <defs>
            <clipPath id={clipId}>
              <animated.path d={path} />
            </clipPath>
          </defs>
          <image
            width="100%"
            height="100%"
            clipPath={`url(#${clipId})`}
            href="/shinji.gif"
            preserveAspectRatio="xMidYMid slice"
          />
        </>
      )}
    </svg>
  )
}
