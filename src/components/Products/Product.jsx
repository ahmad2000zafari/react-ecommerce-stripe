import React from "react";
import addBasket from "../../assets/add_basket_icon.png";

const Product = ({ product, onAddToCart }) => {
  return (
    <div className="flex flex-col sm:flex-row border rounded-lg w-60 sm:w-120 shadow-lg">
      <div className="w-60 h-64">
        <img
          className="object-cover w-full h-full rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
          src={product.media.source}
        />
      </div>
      <div className="w-60 h-64 flex flex-col justify-between items-center sm:mx-6">
        <div className="flex flex-col justify-between items-center w-full h-1/3 px-3 pt-4 text-lg font-semibold text-gray-700 ">
          <h1>{product.name}</h1>
          <h1>{product.price.formatted_with_symbol}</h1>
        </div>
        <div
          className="w-full h-1/3 px-3 text-center pt-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        <div className="flex flex-col justify-between items-center w-full h-1/3 px-2 py-2">
          <button
            className="cursor-pointer float-right"
            onClick={() => onAddToCart(product.id, 1)}
          >
            <img className="w-8 h-8" src={addBasket}></img>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
