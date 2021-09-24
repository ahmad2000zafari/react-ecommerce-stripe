import React from "react";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {
  const numOfItems = cart.total_items;
  const handleEmptyCart = () => onEmptyCart();

  const renderEmptyCart = () => (
    <div className="flex flex-col items-center mt-12 font-bold">
      <h1 className="text-center text-gray-400">
        You have no items in your cart.
      </h1>
      <Link
        className="text-center text-lg border rounded bg-green-400 text-white px-4 py-2 mt-10 font-bold shadow-lg mx-2"
        to="/"
      >
        Go to store and pick some!
      </Link>
    </div>
  );

  if (!cart.line_items)
    return (
      <div className="flex flex-col justify-between items-center text-2xl mt-24">
        <h1>Loading</h1>
      </div>
    );

  const renderCart = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-10 justify-items-center mb-20">
        {cart.line_items.map((lineItem) => (
          <div key={lineItem.id} className="w-60">
            <CartItem
              item={lineItem}
              onUpdateCartQty={onUpdateCartQty}
              onRemoveFromCart={onRemoveFromCart}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between items-center mb-20">
        <h1 className="mb-7 bg-yellow-300 px-5 rounded">
          Total: {cart.subtotal.formatted_with_symbol}
        </h1>
        <div className="flex flex-col sm:space-x-4 space-y-3 sm:space-y-0 sm:flex-row text-white justify-between items-center">
          <button
            className="border bg-red-500 rounded px-3 py-1 font-bold"
            onClick={handleEmptyCart}
          >
            Empty cart
          </button>
          <Link to="/checkout">
            <button className="border  bg-blue-400 rounded px-4 py-1 font-bold">
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="grid grid-col-1 justify-items-center mt-28">
      <h1 className="text-gray-600 font-bold text-lg text-center mb-14">
        Your Shopping Cart
      </h1>
      {!cart.line_items.length ? renderEmptyCart() : renderCart()}
    </div>
  );
};

export default Cart;
