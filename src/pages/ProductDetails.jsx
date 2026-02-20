import { useParams } from "react-router-dom";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();

  const product = products.find(p => p._id === id);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <img src={product.image} width="300" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;