import React from "react";
import Product from "./Product";

const Products = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20 justify-items-center">
      {products.map((product) => (
        <Product product={product} key={product.id} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default Products;
