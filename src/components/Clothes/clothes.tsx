import { useContext } from "react"
import { ClothesContext } from "../Fetch/clothes-context"
import CatalogView from "../Catalog/catalogView"

const ClothesComponent = () => {
  const { clothes, loading, error, refetch } = useContext(ClothesContext)

  return (
    <CatalogView
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
