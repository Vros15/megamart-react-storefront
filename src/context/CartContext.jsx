import { createContext, useReducer } from "react";
import { cartReducer, initialCartState } from "./cartReducer";

// Creates a context for the shopping cart, allowing state and dispatch to be shared across components.
const CartContext = createContext(null);

// Provides the cart context to its child components, allowing them to access and update the cart state.
const CartProvider = ({ children }) => {
  // Initializes the cart state and provides a dispatch function to update it.
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // The context provider makes the cart state and dispatch function available to all child components.
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };
