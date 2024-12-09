import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  function add(item) {
    setCart([...cart, item]);

    localStorage.setItem("cart", JSON.stringify([...cart, item]));
  }

  function remove(index) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);

    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function reset() {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  }

  const subtotal = cart.reduce((prev, curr) => {
    return (
      prev +
      curr?.product?.price +
      curr?.addons?.reduce((prev, curr) => {
        return prev + curr.price;
      }, 0) +
      curr?.variants?.reduce((prev, curr) => {
        return prev + curr.price;
      }, 0)
    );
  }, 0);

  const total = subtotal + 100000;

  console.log("TOT: ", total);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        add,
        remove,
        subtotal,
        total,
        reset,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within an AuthProvider");
  }
  return context;
};
