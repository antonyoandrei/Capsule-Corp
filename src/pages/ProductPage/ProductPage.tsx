import { useParams } from "react-router-dom";
import ProductPageComponent from "../../components/ProductPage/productPage";
import { FC } from "react";


const ProductPage: FC = () => {
    let { id } = useParams();

    if (id) {
        return <ProductPageComponent id={parseInt(id)} name={""} description={""} price={0} mostBuyed={false} img={""} images={[]} quantity={0} />;
    } else {
        return <div>Loading...</div>; 
    }
};

export default ProductPage