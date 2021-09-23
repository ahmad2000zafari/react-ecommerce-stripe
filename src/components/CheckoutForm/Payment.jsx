import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";
import Review from "./Review";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Payment = ({
  checkoutToken,
  shippingData,
  onCaptureCheckout,
  cart,
  error,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  //const [orderData, setOrderData] = useState(null);
  //const [isPayedClicked, setIsPayedClicked] = useState(false);
  const history = useHistory();

  const errorI = error;
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    //if (errorI) {
    //console.log("[error]", errorI);
    //} else {
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
    console.log(orderData);
    console.log("costumer reference", orderData.customer_reference);
    onCaptureCheckout(checkoutToken.id, orderData);
    history.push("/confirmation");
    //timeout();
    //setOrderData(orderData);
    //}
  };

  console.log(isFinished);

  // const payedClicked = () => {
  //   setIsPayedClicked(true);
  // };

  // if (isPayedClicked) {
  //   history.push("/confirmation");
  // }

  return (
    <>
      <Review checkoutToken={checkoutToken} cart={cart} />
      <br />

      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form
              className="m-auto"
              onSubmit={(e) => handleSubmit(e, elements, stripe)}
            >
              <div className=" flex flex-col border mb-5 pb-5">
                <h1 className="text-center my-4 font-bold">Payment method</h1>
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
                    //onClick={payedClicked}
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
