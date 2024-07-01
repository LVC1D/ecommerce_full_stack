import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import Product from "./Product";
import { fetchProducts, selectProducts, selectIsLoading, selectError } from "../features/productSlice";
import { Link } from "react-router-dom";
import ROUTES from "../routes";

function Products() {
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

  return (
    <div>
      <h1>Super Awesome eCommerce site!</h1>
      <p>Feel free to browse around</p>
      <ul>
        {isLoading ? <p>Is loading products...</p> : products.map(product => (
          <li key={product.id}>
              <Link to={ROUTES.PRODUCT(product.id)}>
                  <Product product={product} />
              </Link>
              <button>Add to Cart</button>
          </li>
        ))}
      </ul>
      {isError && <p>Something went wrong loading the products...</p>}
    </div>
  );
}

export default Products;