import { useContext } from "react"
import { ItemsContext } from "../Fetch/items-fetch"
import CatalogView from "../Catalog/catalogView"

const ItemsComponent = () => {
  const { items, loading, error, refetch } = useContext(ItemsContext)

  return (
    <CatalogView
      kicker="Collection"
      title="Items"
      products={items}
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyTitle="No items found"
      emptyCopy="The archive is empty right now."
      countLabel="items"
    />
  )
}

export default ItemsComponent
