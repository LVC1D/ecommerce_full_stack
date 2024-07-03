import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import Product from "../components/Product";
import { fetchProductById, selectSelectedProduct, selectIsLoading, selectError } from "../features/productSlice";
import { useParams } from "react-router-dom";

function ProductDetails() {
    const {productId} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Fetching product with id:', productId);
        if (productId) dispatch(fetchProductById(productId));
    }, [dispatch, productId]);

    const selectedProduct = useSelector(selectSelectedProduct);
    const isLoading = useSelector(selectIsLoading);
    const isError = useSelector(selectError);

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {isError && <p>{isError.message}</p>}
            {selectedProduct && <Product product={selectedProduct} />}
        </div>
    )
}

export default ProductDetails;