import { Navigate, useParams } from "react-router-dom";
import ProductPageComponent from "../../components/ProductPage/productPage";

const ProductPage = () => {
  const { id } = useParams();
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return <Navigate to="/homepage" replace />;
  }

  return <ProductPageComponent id={productId} />;
};

export default ProductPage;
