import { useContext, useMemo } from "react"
import { ClothesContext } from "../Fetch/clothes-context"
import { ItemsContext } from "../Fetch/items-context"
import CatalogView from "../Catalog/catalogView"

const MostBuyedComponent = () => {
  const { clothes, loading: clothesLoading, error: clothesError, refetch: refetchClothes } = useContext(ClothesContext)
  const { items, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useContext(ItemsContext)
  const mostBuyed = useMemo(() => [...clothes, ...items].filter(product => product.mostBuyed), [clothes, items])
  const loading = clothesLoading || itemsLoading
  const error = clothesError || itemsError

  return (
    <CatalogView
      title="Most wanted"
      products={mostBuyed}
      loading={loading}
      error={error}
      onRetry={() => {
        refetchClothes()
        refetchItems()
      }}
      emptyTitle="No featured products"
      emptyCopy="Nothing has been selected yet."
    />
  )
}

export default MostBuyedComponent
