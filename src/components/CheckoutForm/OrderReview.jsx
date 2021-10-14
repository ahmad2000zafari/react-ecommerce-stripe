import React from "react";

const OrderReview = ({ cart, checkoutToken }) => (
  <div className="flex flex-col justify-between items-center m-auto">
    <h1 className="text-center font-bold my-3">Summery of your Order</h1>
    <div className="flex flex-col justify-start items-start border rounded p-3">
      {cart.line_items.map((item) => (
        <div
          className="flex flex-col sm:flex-row justify-between items-center border rounded pr-2"
          key={item.id}
        >
          <div className="flex flex-row justify-start items-center rounded space-x-2">
            <img
              className="object-cover w-10 h-10 rounded"
              src={item.media.source}
              alt={item.name}
            />
            <h1 className="w-24">{item.name}</h1>
            <h1 className="w-4">{item.quantity}</h1>
            <h1 className="w-12">{item.line_total.formatted_with_symbol}</h1>
          </div>
        </div>
      ))}
    </div>
    <h1 className="my-5 bg-yellow-100 px-3 border rounded">
      Total:{checkoutToken.live.subtotal.formatted_with_symbol}
    </h1>
  </div>
);

export default OrderReview;
