function Product({product}) {
    
    console.log(product);
    if (!product) {
        // Render a loading indicator or return null
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.category}</p>
            <p>${product.price}</p>
            <p>Available in stock: {product.quantity}</p>
        </div>
    )
}

export default Product;