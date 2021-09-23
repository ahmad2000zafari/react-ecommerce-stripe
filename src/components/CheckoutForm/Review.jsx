import React from "react";

const Review = ({ cart, checkoutToken }) => (
  <div className="flex flex-col border ">
    <h1 className="text-center font-bold my-3">Summery of your Order</h1>
    <div className="flex flex-row">
      <div className="flex flex-col justify-between items-center">
        {cart.line_items.map((item) => (
          <div key={item.id} className="w-8 h-8">
            <img
              className="w-full h-full"
              src={item.media.source}
              alt={item.name}
            />
          </div>
        ))}
      </div>
      <div>
        {checkoutToken.live.line_items.map((product) => (
          <div
            className="flex flex-row justify-between items-center"
            key={product.name}
          >
            {product.name}
            {`Quantity: ${product.quantity}`}

            <h1>{product.line_total.formatted_with_symbol}</h1>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h1>{checkoutToken.live.subtotal.formatted_with_symbol}</h1>
    </div>
  </div>
);

export default Review;
