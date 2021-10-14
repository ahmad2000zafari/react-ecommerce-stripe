import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { commerce } from "./lib/commerce";
import { Link } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Products from "./components/Products/Products";
import Cart from "./components/Cart/Cart";
import AddressForm from "./components/CheckoutForm/AddressForm";
import Payment from "./components/CheckoutForm/Payment";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [orderData, setOrderData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const test = (data) => {
    setShippingData(data);
  };
  const orderDataNullHandler = () => {
    setOrderData({});
  };

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
      setOrderData(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
      console.log(error.data.error.message);
    }
  };

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
      <div className="flex flex-col justify-between items-center mt-32">
        <div className="flex flex-col justify-between items-center w-32 h-32 ">
          <span class="flex flex-col justify-between items-center h-3 w-3">
            <span
              class="animate-ping h-24 w-24 
          rounded-full bg-purple-400 opacity-75"
            ></span>
            <span class="rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </div>
      </div>
    );

  if (errorMessage) {
    Confirm = () => (
      <div className="flex flex-col justify-between items-center">
        <h1>Error: {errorMessage}</h1>
        <br />
        <div>
          <Link className="border px-3 rounded" exact to="/">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

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
            order={orderData}
            error={errorMessage}
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
