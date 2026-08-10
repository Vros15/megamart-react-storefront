// imports React's useContext hook and the CartContext from the context file for accessing the cart state and dispatch function.
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// Custom hook to access the cart context, ensuring it is used within a CartProvider.
const useCart = () => {

  // Accesses the cart context using the useContext hook.
  const context = useContext(CartContext);

  // Throws an error if the hook is used outside of a CartProvider.
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Returns the cart context, which includes the current state and the dispatch function.
  return context;
};

export default useCart;
