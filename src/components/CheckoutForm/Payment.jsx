import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import OrderReview from "./OrderReview";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Payment = ({ checkoutToken, shippingData, onCaptureCheckout, cart }) => {
  const history = useHistory();

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: {
          firstname: shippingData.firstName,
          lastname: shippingData.lastName,
          email: shippingData.email,
        },
        shipping: {
          name: "International",
          street: shippingData.address,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zipCode,
          country: shippingData.country,
        },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: "test_gateway",
          card: {
            number: "4242 4242 4242 4242",
            expiry_month: "01",
            expiry_year: "2023",
            cvc: "123",
            postal_zip_code: "94103",
          },
        },
      };

      onCaptureCheckout(checkoutToken.id, orderData);
      history.push("/confirmation");
    }
  };

  return (
    <>
      <OrderReview checkoutToken={checkoutToken} cart={cart} />
      <br />

      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form
              className="m-auto"
              onSubmit={(e) => handleSubmit(e, elements, stripe)}
            >
              <h1 className="text-center my-2 font-bold">Payment method</h1>
              <div className="flex flex-col justify-between items-center">
                <div className=" flex flex-col justify-beween items-center text-center border rounded text-xs font-semibold w-60 mb-1">
                  <h1>The web is in test mode.</h1>
                  <h1>Test card number 4242 4242 4242 4242.</h1>
                </div>
              </div>
              <div className=" flex flex-col border mb-5 mx-2 sm:mx-auto px-3 py-2 sm:w-160 rounded">
                <CardElement />
              </div>
              <br /> <br />
              <div className="flex flex-col items-center">
                <div className="flex flex-row space-x-3">
                  <button
                    type="button"
                    className="border px-4 text-white bg-gray-400 rounded font-bold"
                    onClick={() => history.push("/checkout")}
                  >
                    Back
                  </button>

                  <button
                    className="border px-4 text-white bg-blue-600 rounded font-bold"
                    type="submit"
                    disabled={!stripe}
                  >
                    Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                  </button>
                </div>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default Payment;
