import React, { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import { commerce } from "../../lib/commerce";

import { Link, useHistory } from "react-router-dom";

const CheckoutToken = ({ cart }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  //const [shippingData, setShippingData] = useState({});

  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, {
            type: "cart",
          });

          setCheckoutToken(token);
        } catch {}
      };

      generateToken();
    }
  }, [cart]);

  //const test = (data) => {
  // setShippingData(data);
  //};

  return (
    <div>
      {checkoutToken && (
        <AddressForm
          checkoutToken={checkoutToken}
          test={test}
          //setShippingData={setShippingData}
        />
      )}
    </div>
  );
};

export default CheckoutToken;
