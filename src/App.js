import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { commerce } from "./lib/commerce";
import { Link, useHistory } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Products from "./components/Products/Products";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckoutForm/Checkout";
import AddressForm from "./components/CheckoutForm/AddressForm";
import CheckoutToken from "./components/CheckoutForm/CheckoutToken";
import Payment from "./components/CheckoutForm/Payment";
import Paytest from "./components/CheckoutForm/Paytest";
import Confirmation from "./components/CheckoutForm/Confirmation";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState(null);

  const [orderData, setOrderData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  //const [isPayedClicked, setIsPayedClicked] = useState(false);
  const history = useHistory();
  const test = (data) => {
    setShippingData(data);
    console.log(shippingData);
    console.log("it is working");
  };
  const orderDataNullHandler = () => {
    setOrderData({});
  };
  const homeBackHandler = () => {
    history.push("/");
    //setOrderData({});
    orderDataNullHandler();
  };

  console.log(shippingData);
  const fetchProducts = async () => {
    const { data } = await commerce.products.list();

    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);

    setCart(item.cart);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    setCart(response.cart);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove(lineItemId);

    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    console.log(newOrder);
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      console.log(incomingOrder);
      setOrderData(incomingOrder);

      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
      console.log(error.data.error.message);
    }
  };

  // const payedClicked = () => {
  //   //setIsPayedClicked(true);
  //   history.push("/confirmation");
  // };

  // const timeout = () => {
  //   console.log("THE TIMEOUT IS RAN!");
  //   setTimeout(() => {
  //     setIsFinished(true);
  //   }, 3000);
  // };

  console.log(orderData);

  let Confirm = () =>
    orderData.customer ? (
      <div className="flex flex-col justify-between items-center w-11/12 sm:w-2/3 lg:w-1/2 mt-20 m-auto">
        <div className="flex flex-col justify-between items-center border rounded-lg p-10 sm:p-20  space-y-4 text-base">
          <h1 className="text-center">Thank you for your purchase,</h1>
          <h1 className="text-center">
            {orderData.customer.firstname} {orderData.customer.lastname}!
          </h1>
          <div className="flex flex-col sm:flex-row text-center">
            <h1>Order ref:</h1>
            <h1> {orderData.customer_reference}</h1>
          </div>
        </div>
        <br />
        <Link
          to="/"
          className="bg-blue-600 text-white font-semibold rounded px-4 py-2 mt-8"
          onClick={orderDataNullHandler}
        >
          Back to home
        </Link>
      </div>
    ) : (
      <div>
        <button type="button" className="bg-red-600" disabled>
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
          Processing
        </button>
      </div>
    );

  //console.log(isPayedClicked);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

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
  console.log(shippingData);

  return (
    <Router>
      <Navbar
        totalItems={cart.total_items}
        orderDataNull={orderDataNullHandler}
      />
      <Switch>
        <Route exact path="/">
          <Products products={products} onAddToCart={handleAddToCart} />
        </Route>
        <Route exact path="/cart">
          <Cart
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onEmptyCart={handleEmptyCart}
          />
        </Route>
        <Route path="/checkout" exact>
          {checkoutToken && (
            <AddressForm
              checkoutToken={checkoutToken}
              test={test}
              shippingData={shippingData}
            />
          )}
        </Route>
        <Route path="/payment" exact>
          <Payment
            cart={cart}
            checkoutToken={checkoutToken}
            shippingData={shippingData}
            onCaptureCheckout={handleCaptureCheckout}
            //timeout={timeout}
            order={orderData}
            error={errorMessage}
            //payedClicked={payedClicked}
          />
        </Route>
        <Route path="/confirmation" exact>
          <Confirm />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
