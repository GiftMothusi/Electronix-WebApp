import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";

import { TiDeleteOutline } from "react-icons/ti";
import { toast } from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleShoppingCartItemQuantity,
    removeItemFromCart,
  } = useStateContext();

  //Handle Checkout Method
  const handleCheckout = async () => {
    //get instance of stripe
    const stripe = await getStripe();

    //api request to our own nextjs backend
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return console.log(response.statusCode);

    const data = await response.json();
    toast.loading("Redirecting...");

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Shopping Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {/* Handle case if shopping cart is empty render a button to go back to the products shopping page  */}
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your Shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                className="btn"
                onClick={() => setShowCart(false)}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        {/* Handle case for if shopping cart has items on it, they need to be displayed
         to the user in the cart page  */}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>R {item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShoppingCartItemQuantity(item, "decrease");
                          }}
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item?.quantity}</span>
                        <span
                          className="plus"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShoppingCartItemQuantity(item, "increase");
                          }}
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    {/* Removing item from the shopping cart  */}
                    <button
                      type="button"
                      className="remove-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItemFromCart(item);
                      }}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Render the subtotal and total price of the cart */}
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>R {totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
