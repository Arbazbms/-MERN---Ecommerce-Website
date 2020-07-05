import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckOut from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";
const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-type": "application/json",
    };

    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        //call further methods
        const { status } = response;
        console.log("STATUS", status);
        const orderData = {
          products: products,
          transaction_id: response.transaction_id,
          amount: response.transaction_amount,
        };
        createOrder(userId, token, orderData);

        cartEmpty(() => {
          console.log("do we have a bug!");
        });
        setReload(!reload);
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckOut
        stripeKey="pk_test_51GrGi8HjY5JjeE3i8pw5QoPTkxoWEmvQhqIUN2plJAI7kOMGXcwpYILPrbk7bqBzttObWUzy9nKbfXvcy8aT4Vwo00vm2msQRe"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy T-Shirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">pay with Stripe</button>
      </StripeCheckOut>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe Checkout {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};
export default StripeCheckout;
