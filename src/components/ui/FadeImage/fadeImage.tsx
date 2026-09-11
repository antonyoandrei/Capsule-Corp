import { useCallback, useLayoutEffect, useRef, useState } from "react"
import type { ImgHTMLAttributes } from "react"
import "./fade-image.css"

interface FadeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

const FadeImage = ({ src, srcSet, sizes, alt, className, loading = "lazy", decoding = "async", fetchPriority, onLoad, onError, ...props }: FadeImageProps) => {
  const sourceKey = `${src}\0${srcSet ?? ""}\0${sizes ?? ""}`
  const [result, setResult] = useState<{ source: string; status: "loaded" | "error" } | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const status = result?.source === sourceKey ? result.status : "loading"

  const settleImage = useCallback(async (image: HTMLImageElement) => {
    if (image.naturalWidth > 0) {
      try {
        await image.decode()
      } catch {
        // Some browsers reject decode after a resource change; keep a drawable image usable.
      }
    }
    if (imageRef.current !== image) return
    const nextStatus = image.naturalWidth > 0 ? "loaded" : "error"
    setResult(current => current?.source === sourceKey && current.status === nextStatus
      ? current
      : { source: sourceKey, status: nextStatus })
  }, [sourceKey])

  useLayoutEffect(() => {
    setResult(null)
    const image = imageRef.current
    if (image?.complete) void settleImage(image)
  }, [settleImage])

  return (
    <img
      {...props}
      fetchPriority={fetchPriority}
      key={sourceKey}
      ref={imageRef}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      decoding={decoding}
      loading={loading}
      className={`fade-image ${status === "loading" ? "" : `is-${status}`} ${className ?? ""}`.trim()}
      data-image-state={status}
      onLoad={event => { void settleImage(event.currentTarget); onLoad?.(event) }}
      onError={event => { void settleImage(event.currentTarget); onError?.(event) }}
    />
  )
}

export default FadeImage
