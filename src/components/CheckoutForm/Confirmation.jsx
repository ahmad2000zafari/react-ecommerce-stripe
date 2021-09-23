import React from "react";

const Confirmation = ({ order, isFinished, error }) => {
  let Confirm = () =>
    order.customer ? (
      <>
        <div>
          <h1>
            Thank you for your purchase, {order.customer.firstname}{" "}
            {order.customer.lastname}!
          </h1>

          <h1>Order ref: {order.customer_reference}</h1>
        </div>
        <br />
        <button type="button" to="/">
          Back to home
        </button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <h1>Thank you for your purchase!</h1>
        </div>
        <br />
        <button type="button" to="/">
          Back to home
        </button>
      </>
    ) : (
      <div>
        <button type="button" className="bg-rose-600 ..." disabled>
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            viewBox="0 0 24 24"
          ></svg>
          Processing
        </button>
      </div>
    );

  if (error) {
    Confirm = ({ error }) => (
      <>
        <h1>Error: {error}</h1>
        <br />
        <button type="button" to="/">
          Back to home
        </button>
      </>
    );
  }

  return (
    <div>
      <Confirm />
    </div>
  );
};

export default Confirmation;
