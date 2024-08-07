import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchProducts, selectProducts, selectError } from "../features/productSlice";
import { addToCart, fetchCartByIds, createCart } from "../features/cartSlice";
import { selectSearchTerm } from "../features/searchSlice";
import { Link } from "react-router-dom";
import ROUTES from "../routes";
import './Products.css';

function Products() {
  const products = useSelector(selectProducts);
  const isError = useSelector(selectError);
  const dispatch = useDispatch();
  const {cart} = useSelector((state) => state.cart);
  const {user, isAuth} = useSelector((state) => state.auth);
  const searchTerm = useSelector(selectSearchTerm);

  useEffect(() => {
    if (!searchTerm) dispatch(fetchProducts())
  }, [dispatch, searchTerm]);

  const handleAddToCart = async (productId) => {
    try {
      if (user && isAuth) {
        await dispatch(addToCart({ cartId: cart.id, productId })).unwrap();
        await dispatch(fetchCartByIds(user.id)).unwrap();
        // console.log("Item added for the user:", user.id, "and cart:", cart.id)
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (!Array.isArray(products)) {
    return null;
  }
  
  return (
    <div className="products">
      <h1>Super Awesome eCommerce site!</h1>
      <ul className="products-grid">
        {products && products.map(product => (
          <li key={product.id}>
              <Link to={ROUTES.PRODUCT(product.id)}>
                <h2>{product.name}</h2>
                <p>{product.category}</p>
                <p>${product.price}</p>
                {product.quantity === 0 ? <p className="out">Out of stock!</p> : <p className="instock">In stock</p>}
              </Link>
              {cart ? <button id="add-to-cart" disabled={product.quantity === 0} onClick={() => handleAddToCart(product.id)}>Add to Cart</button> : <button>Add to Cart</button>}
          </li>
        ))}
      </ul>
      {isError && <p>Something went wrong loading the products...</p>}
    </div>
  );
}

export default Products;