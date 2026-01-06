import { useSpring, animated } from 'react-spring'
import blobshape from 'blobshape'
import { CSSProperties, useState } from 'react'

type BlobProps = {
  color?: string
  image?: boolean
  style?: CSSProperties
}

export default function BlobComponent(): JSX.Element {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Blob
        color="#000000"
        style={{ opacity: 0.2, position: 'absolute', top: 0, left: 0 }}
      />
      <Blob
        color="#000000"
        style={{ opacity: 0.4, position: 'absolute', top: 0, left: 0 }}
      />
      <Blob
        color="#000000"
        style={{ opacity: 0.5, position: 'absolute', top: 0, left: 0 }}
      />
      <Blob
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

function getRandomPath(): string {
  return blobshape({
    growth: 7,
    edges: 18
  }).path
}

function Blob({ color, image, style }: BlobProps): JSX.Element {
  const [flip, setFlip] = useState(false)

  const { path } = useSpring<{ path: string }>({
    to: { path: getRandomPath() },
    from: { path: getRandomPath() },
    reverse: flip,
    config: {
      duration: image ? 9000 : 6000
    },
    onRest: () => {
      setFlip((prev) => !prev)
    }
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
            <clipPath id="blob-clip">
              <animated.path d={path} />
            </clipPath>
          </defs>
          <image
            width="100%"
            height="100%"
            clipPath="url(#blob-clip)"
            href="/rei.gif"
            preserveAspectRatio="xMidYMid slice"
          />
        </>
      )}
    </svg>
  )
}
