import { FC } from "react"
import { useLocation } from "react-router-dom"
import { artwork } from "../../services/artwork"
import { clProduct } from "../../types/interface"
import FrameComponent from "../Frame/frame"
import TabComponent from "../Tab/tab"
import DataState from "../ui/DataState/dataState"
import PageHeader from "../ui/PageHeader/pageHeader"
import CatalogSkeleton from "../ui/Skeleton/skeleton"
import LoadingReveal from "../ui/Skeleton/loadingReveal"
import FadeImage from "../ui/FadeImage/fadeImage"
import "./catalog-view.css"

const catalogArtwork: Record<string, { image: string; name: string; width: number; height: number; srcSet?: string; sizes?: string }> = {
  "/clothes": { image: artwork("gohan", 826), name: "clothes", width: 826, height: 1799, srcSet: `${artwork("gohan", 480)} 480w, ${artwork("gohan", 826)} 826w`, sizes: "(max-width: 672px) 50vw, 352px" },
  "/items": { image: artwork("trunks", 900), name: "items", width: 900, height: 2020, srcSet: `${artwork("trunks", 360)} 360w, ${artwork("trunks", 900)} 900w`, sizes: "(max-width: 672px) 50vw, 224px" },
  "/most-buyed": { image: artwork("wantedGoku", 900), name: "wanted", width: 900, height: 900 },
}

interface CatalogViewProps {
  title: string
  products: clProduct[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  emptyTitle: string
  emptyCopy: string
  emptyActionLabel?: string
  emptyTo?: string
  countLabel?: string
}

const CatalogView: FC<CatalogViewProps> = ({
  title,
  products,
  loading = false,
  error,
  onRetry,
  emptyTitle,
  emptyCopy,
  emptyActionLabel,
  emptyTo,
  countLabel,
}) => {
  const { pathname } = useLocation()
  const artwork = catalogArtwork[pathname]
  const heading = (
    <PageHeader
      title={title}
      count={loading ? undefined : products.length}
      countLabel={countLabel}
    />
  )

  return (
    <>
      {artwork ? (
        <div className={`catalog-heading catalog-heading--${artwork.name}`}>
          {heading}
          <div className="catalog-art-window" aria-hidden="true">
            <FadeImage src={artwork.image} srcSet={artwork.srcSet} sizes={artwork.sizes} width={artwork.width} height={artwork.height} alt="" loading="eager" />
          </div>
        </div>
      ) : heading}
      <LoadingReveal loading={loading && products.length === 0} skeleton={<FrameComponent><CatalogSkeleton /></FrameComponent>}>
      <FrameComponent>
        {error && products.length === 0 && (
          <DataState title={`${title} unavailable`} actionLabel="Try again" onAction={onRetry} variant="error">
            {error}
          </DataState>
        )}
        {!error && products.length === 0 && (
          <DataState title={emptyTitle} actionLabel={emptyActionLabel} to={emptyTo}>
            {emptyCopy}
          </DataState>
        )}
        {products.map((product, index) => (
          <TabComponent key={product.id} {...product} priority={index < 4} />
        ))}
      </FrameComponent>
      </LoadingReveal>
    </>
  )
}

export default CatalogView
