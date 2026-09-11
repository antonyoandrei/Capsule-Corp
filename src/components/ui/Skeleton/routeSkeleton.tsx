import CatalogSkeleton, { ProductSkeleton } from "./skeleton"
import FrameComponent from "../../Frame/frame"

export const LoginSkeleton = () => (
  <div className="login-skeleton" role="status" aria-label="Loading login">
    <div aria-hidden="true"><span className="skel-line" /><span className="skel-line" /><span className="skel-line" /></div>
  </div>
)

const RouteSkeleton = ({ pathname }: { pathname: string }) => (
  <div className="route-content route-skeleton" role="status" aria-label="Loading page">
    {pathname.startsWith("/product-page/") ? (
      <><div className="route-skeleton-back" aria-hidden="true"><span className="skel-line" /></div><ProductSkeleton /></>
    ) : (
      <>
        <div className="route-skeleton-heading" aria-hidden="true"><span className="skel-line" /><span className="skel-line" /></div>
        {["/clothes", "/items", "/most-buyed"].includes(pathname) ? (
          <FrameComponent><CatalogSkeleton /></FrameComponent>
        ) : (
          <div className="route-skeleton-copy" aria-hidden="true"><span className="skel-line" /><span className="skel-line" /><span className="skel-line skel-short" /></div>
        )}
      </>
    )}
  </div>
)

export default RouteSkeleton
