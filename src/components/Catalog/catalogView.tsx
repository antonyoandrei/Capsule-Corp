import { FC } from "react"
import { clProduct } from "../../types/interface"
import FrameComponent from "../Frame/frame"
import TabComponent from "../Tab/tab"
import DataState from "../ui/DataState/dataState"
import PageHeader from "../ui/PageHeader/pageHeader"
import CatalogSkeleton from "../ui/Skeleton/skeleton"

interface CatalogViewProps {
  kicker: string
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
  kicker,
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
  return (
    <>
      <PageHeader
        kicker={kicker}
        title={title}
        count={loading ? undefined : products.length}
        countLabel={countLabel}
      />
      <FrameComponent>
        {loading && <CatalogSkeleton />}
        {!loading && error && (
          <DataState title={`${title} unavailable`} actionLabel="Try again" onAction={onRetry} variant="error">
            {error}
          </DataState>
        )}
        {!loading && !error && products.length === 0 && (
          <DataState title={emptyTitle} actionLabel={emptyActionLabel} to={emptyTo}>
            {emptyCopy}
          </DataState>
        )}
        {!loading && !error && products.map(product => (
          <TabComponent key={product.id} {...product} />
        ))}
      </FrameComponent>
    </>
  )
}

export default CatalogView
