import React from "react";

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const handleUpdateCartQty = (lineItemId, newQuantity) =>
    onUpdateCartQty(lineItemId, newQuantity);

  const handleRemoveFromCart = (lineItemId) => onRemoveFromCart(lineItemId);

  return (
    <div className="flex flex-col border justify-between items-center rounded-lg shadow-lg">
      <div className="w-60 h-64 rounded-lg">
        <img
          className="object-cover w-full h-full rounded-t-lg"
          src={item.media.source}
          alt={item.name}
        />
      </div>
      <div className=" w-60 h-16 flex flex-row justify-between items-center px-3">
        <h1>{item.name}</h1>
        <h1 className="pr-2">{item.line_total.formatted_with_symbol}</h1>
      </div>
      <div className="w-60 h-16 flex flex-row justify-between items-center px-3">
        <div className="flex flex-row justify-between items-center w-24 h-6 border text-xl font-black text-white rounded px-3 bg-green-500">
          <button
            className=""
            onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}
          >
            -
          </button>
          <h1>{item.quantity}</h1>
          <button
            onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <button
          className="bg-red-500 shadow-lg text-white px-2 rounded"
          onClick={() => handleRemoveFromCart(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
