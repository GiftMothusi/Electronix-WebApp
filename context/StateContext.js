import React, { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  //cart state
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [totalPrice, SetTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  //shopping cart item special properties to keep state of cart item quantity
  let foundProduct;
  let index;

  //Quantity Increase and Decrease methods
  const increaseQty = () => {
    setQty((previousQty) => previousQty + 1);
  };

  const decreaseQty = () => {
    setQty((previousQty) => {
      if (previousQty === 1) return 1; //if qty is LESS THAN 1, do nothing
      return previousQty - 1;
    });
  };

  //On add to cart method
  const onAddToCart = (product, quantity) => {
    /*check if the product is already in the cart and if so we will just increase the quantity instead of 
    adding duplicstes of the same product to the shopping cart */

    const checkIfProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    SetTotalPrice(
      (previousTotalPrice) => previousTotalPrice + product.price * quantity
    );
    setTotalQuantities(
      (previousTotalQuantities) => previousTotalQuantities + quantity
    );
    if (checkIfProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return { ...cartProduct, quantity: cartProduct.quantity + quantity };
        }
      });
      setCartItems(updatedCartItems);
    } else {
      /*The product does not exist in the cart thus we have to add a new product to the cart, 
     a different one from the one thats already in the cart
      */
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to cart.`); //print messenge to the user on successful add to cart
  };

  //Method to remove item from cart
  const removeItemFromCart = (product) => {
    const newCartItems = cartItems.filter((item) => item._id !== product._id);
    setCartItems(newCartItems);
    //console.log(newCartItems + "THESE ARE THE NEW CART ITEMS");
    SetTotalPrice(
      (prevTotalPrice) => prevTotalPrice - product.price * product.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - product.quantity
    );
    toast.success(`${product.name} - removed from cart.`, {
      position: "top-right",
      style: {
        background: "#FFCCBC",
      },
    });
  };

  //Method to increase the quantity of a product in the cart
  const toggleShoppingCartItemQuantity = (product, value) => {
    if (value === "decrease") {
      if (product.quantity > 1) {
        const updatedProduct = cartItems.map((item) =>
          item._id === product._id
            ? { ...product, quantity: product.quantity - 1 }
            : item
        );
        setCartItems(updatedProduct);
        SetTotalPrice((prevTotalPrice) => prevTotalPrice - product.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    } else if (value === "increase") {
      const updatedProduct = cartItems.map((item) =>
        item._id === product._id
          ? { ...product, quantity: product.quantity + 1 }
          : item
      );
      setCartItems(updatedProduct);
      SetTotalPrice((prevTotalPrice) => prevTotalPrice + product.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    }
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        increaseQty,
        decreaseQty,
        onAddToCart,
        setShowCart,
        setCartItems,
        setTotalQuantities,
        SetTotalPrice,
        toggleShoppingCartItemQuantity,
        removeItemFromCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

//this function allows us to easily grab the states in other components
export const useStateContext = () => useContext(Context);
