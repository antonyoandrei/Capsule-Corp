import { useContext } from "react"
import { ClothesContext } from "../Fetch/clothes-fetch"
import CatalogView from "../Catalog/catalogView"

const ClothesComponent = () => {
  const { clothes, loading, error, refetch } = useContext(ClothesContext)

  return (
    <CatalogView
      kicker="Collection"
      title="Clothes"
      products={clothes}
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyTitle="No clothes found"
      emptyCopy="The archive is empty right now."
    />
  )
}

export default ClothesComponent
