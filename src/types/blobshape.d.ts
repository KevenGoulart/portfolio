declare module 'blobshape' {
  interface BlobShapeOptions {
    growth?: number
    edges?: number
  }

  interface BlobShapeResult {
    path: string
  }

  export default function blobshape(options?: BlobShapeOptions): BlobShapeResult
}
