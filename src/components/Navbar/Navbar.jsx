import React from "react";
import { Link } from "react-router-dom";
import addBasket from "../../assets/cart_basket_add_icon.png";

const Navbar = ({ totalItems }) => {
  return (
    <div className="flex flex-row justify-between items-center border-b p-6 mb-1 shadow-sm w-full text-xl font-bold filter drop-shadow">
      <Link to="/">
        <h1>Shop Now</h1>
      </Link>
      <div className="flex flex-row justify-between items-center filter drop-shadow">
        <div>
          <Link to="/cart">
            <button>
              <div className="w-7 h-7 rounded-full border-2 ml-2 -mb-1 bg-red-500 text-white text-lg">
                {totalItems}
              </div>
              <img className="w-9 h-9" src={addBasket}></img>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
