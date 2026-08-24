import { useEffect, useRef, useState } from "react"
import "./fade-image.css"

interface FadeImageProps {
  src: string
  alt: string
  className?: string
}

const FadeImage = ({ src, alt, className }: FadeImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setLoaded(Boolean(imageRef.current?.complete))
  }, [src])

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      decoding="async"
      className={`fade-image ${loaded ? "is-loaded" : ""} ${className ?? ""}`.trim()}
      onLoad={() => setLoaded(true)}
    />
  )
}

export default FadeImage
