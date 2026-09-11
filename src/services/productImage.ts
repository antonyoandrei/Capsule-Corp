const cloudinaryUpload = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!s--)(.+)$/

export const productImage = (src: string, width: number): string => {
  const match = src.match(cloudinaryUpload)
  if (!match || !Number.isFinite(width) || width <= 0) return src
  const original = match[2].replace(/^(?:f_auto,q_auto,c_limit,w_\d+\/)+/, "")
  return `${match[1]}f_auto,q_auto,c_limit,w_${Math.max(1, Math.round(width))}/${original}`
}

export const productImageSrcSet = (src: string, widths: readonly number[]): string | undefined => {
  if (!cloudinaryUpload.test(src)) return undefined
  const candidates = [...new Set(widths.filter(width => Number.isFinite(width) && width > 0)
    .map(width => Math.max(1, Math.round(width))))].sort((a, b) => a - b)
  return candidates.map(width => `${productImage(src, width)} ${width}w`).join(", ") || undefined
}
